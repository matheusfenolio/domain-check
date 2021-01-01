import axios from 'axios';
import * as ping from 'ping';
import Table from 'cli-table';

const isPortReachable = require('is-port-reachable');

export enum RequestType {
    GET = 'GET',
    POST = 'POST',
    DELETE = 'DELETE',
    PUT = 'PUT',
    PATCH = 'PATCH'
}
export interface IHost {
    name: string,
    host: string,
    port: number,
    httpRequestType: RequestType,
    header?: object,
    body?: object,
    bypassHttp?: boolean,
    bypassPing?: boolean,
    bypassPort?: boolean,
}

export interface IResults {
    isAlive: boolean,
    hostName: string,
    host: string,
    http: string | number,
    ping: boolean | string,
    port: boolean | string,
    packetLoss: string;
}

const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

export const checkHosts = async (hosts: IHost[], showTable?: boolean, showOnlyErrors?: boolean): Promise<IResults[]> => {
    const results: IResults[] = [];

    const promises = hosts.map(async hostObject => {

        if(hostObject.bypassHttp && hostObject.bypassPing && hostObject.bypassPort){
            return;
        }

        const host = hostObject.host;

        let axiosResponse = null;
        let axiosError = null;
        let pingResponse = null;
        const isValidUrl = urlRegex.test(host);

        let isAlivePing = hostObject.bypassPing;
        let isAliveHttp = hostObject.bypassHttp;
        let isAlivePort = hostObject.bypassPort;
        
        if(!hostObject.bypassPing){
            try{
                pingResponse = await ping.promise.probe(host.replace('http://', '').replace('https://', '').replace('www.', ''))
                isAlivePing = pingResponse.alive;
            }catch(err){
                console.error(err);
            }
            
        }

        if(!isValidUrl){
            axiosResponse = { status: 'NOT VALID' }
        }else if(!hostObject.bypassHttp){
            try{
                axiosResponse = await axios({
                    url: hostObject.host,
                    method: hostObject.httpRequestType,
                    headers: hostObject.header, 
                    data: hostObject.body
                  });

                isAliveHttp = true;
            }catch(err){
                axiosError = err.code?err.code:err.response.status;
            }
        }  

        if(!hostObject.bypassPort){
            isAlivePort = await isPortReachable(hostObject.port, {host: host.replace('http://', '').replace('https://', '').replace('www.', '')})
        }

        results.push(
            { 
                isAlive: isAlivePing && isAliveHttp && isAlivePort?isAlivePort:false, 
                hostName: hostObject.name,
                host: hostObject.host,
                http: hostObject.bypassHttp? 'SKIPED':axiosResponse!==undefined&&axiosResponse!==null? axiosResponse.status: axiosError, 
                ping: hostObject.bypassPing? 'SKIPED':isAlivePing!==undefined?isAlivePing:false,
                port: hostObject.bypassPort? 'SKIPED':isAlivePort!==undefined?isAlivePort:false,
                packetLoss: hostObject.bypassPing? '':`${pingResponse?pingResponse.packetLoss:'NO INFO'}`,
          });
    });

    await Promise.all(promises)

    if(showTable){
        // console.clear();
        const table = new Table({
            head: ['STATUS', 'NAME', 'HOST', 'HTTP', 'PORT', 'PING', 'LOSS%'],
            colAligns: ["middle", "left", "left", "middle", "middle", "middle", "middle"]
        });
    
        results.filter(result => showOnlyErrors?result.isAlive===false:result.isAlive===result.isAlive).sort((a,b) => (b.isAlive - a.isAlive)).forEach(result => {
            table.push([result.isAlive?'✔':'✖', result.hostName, result.host, result.http, result.port?'✔':result.port!=='SKIPED'?'SKIPED':'✖', result.ping? '✔':result.ping!=='SKIPED'?'SKIPED':'✖', result.packetLoss]);
        })

        console.log(table.toString());
    }

    return results;
}