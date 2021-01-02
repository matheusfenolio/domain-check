import axios from 'axios';
import { PingResponse, promise } from 'ping';
import Table from 'cli-table';
import _ from 'lodash';
import HTTPStatus from './httpStatusCode';

const isPortReachable = require('is-port-reachable');

export enum ResponseStatus {
    PASSED = 'PASSED',
    ERROR = 'ERROR',
    INVALID = 'INVALID',
    SKIPPED = 'SKIPPED'
}

export enum RequestType {
    GET = 'GET',
    POST = 'POST',
    DELETE = 'DELETE',
    PUT = 'PUT',
    PATCH = 'PATCH'
}

interface IHostResponse {
    isAlive: boolean,
    code: string,
    packetLoss?: string
}

export interface IHost {
    host: string,
    identifier?: string,
    port?: number,
    httpRequestType?: RequestType,
    header?: object | null,
    body?: object | null,
    bypassHttp?: boolean,
    bypassPing?: boolean,
    bypassPort?: boolean,
}


export interface IResults {
    isAlive: boolean,
    hostIdentifier: string,
    host: string,
    http: string,
    ping: string,
    port: string,
    packetLoss: string;
}

const validateURL = (url: string): boolean => {
    const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

    return urlRegex.test(url)
}

const requestHttp = async (host: IHost): Promise<IHostResponse> => {
    if(host.bypassHttp){
        return { isAlive: true, code: ResponseStatus.SKIPPED};
    }

    try{
        if(validateURL(host.host)){
            const response = await axios({
                url: host.host,
                method: _.isNil(host.httpRequestType)?RequestType.GET:host.httpRequestType,
                headers: host.header, 
                data: host.body
              });
            return { isAlive: true, code: HTTPStatus(response.status)};
        }else{
            return { isAlive: false, code: ResponseStatus.INVALID  }
        }
    }catch(err){
        return { isAlive: false, code: _.isNil(err.code)?HTTPStatus(err.response.status):HTTPStatus(err.code) }
    }
}

const requestPing = async (host: IHost): Promise<IHostResponse> => {
    if(host.bypassPing){
        return { isAlive: true, code: ResponseStatus.SKIPPED, packetLoss: ResponseStatus.SKIPPED};
    }
    
    try{
        const response: PingResponse = await promise.probe(host.host.replace('http://', '').replace('https://', '').replace('www.', ''))
        return { 
            isAlive: response.alive, 
            code: response.alive?ResponseStatus.PASSED:ResponseStatus.ERROR, 
            packetLoss: response.alive?response.packetLoss:ResponseStatus.ERROR 
        }
    }catch(err){
        return { isAlive: false, code: ResponseStatus.ERROR, packetLoss: ResponseStatus.ERROR }
    }
}

const requestPort = async (host: IHost): Promise<IHostResponse> => {
    if(host.bypassPort || _.isNil(host.port)){
        return { isAlive: true, code: ResponseStatus.SKIPPED};
    }
    
    try {
        const response = await isPortReachable(host.port, {host: host.host.replace('http://', '').replace('https://', '').replace('www.', '')})        
        return { isAlive: response, code: response?ResponseStatus.PASSED:ResponseStatus.ERROR }
    } catch (err) {
        return { isAlive: false, code: ResponseStatus.ERROR }
    }
}

const isHostAlive = (host: IHost, http: IHostResponse, ping: IHostResponse, port: IHostResponse): boolean => {
    return http.isAlive&&ping.isAlive&&port.isAlive;
} 

export const checkHosts = async (hosts: IHost[], showTable?: boolean, showOnlyErrors?: boolean): Promise<IResults[]> => {
    const results: IResults[] = [];

    const promises = hosts.map(async hostObject => {        
        const responseHttp:IHostResponse = await requestHttp(hostObject);
        const responsePing:IHostResponse = await requestPing(hostObject);
        const responsePort:IHostResponse = await requestPort(hostObject);

        results.push(
            { 
                isAlive: isHostAlive(hostObject, responseHttp, responsePing, responsePort), 
                hostIdentifier: _.isNil(hostObject.identifier)?hostObject.host:hostObject.identifier,
                host: hostObject.host,
                http: responseHttp.code, 
                ping: responsePing.code,
                port: responsePort.code,
                packetLoss: _.isNil(responsePing.packetLoss)?'0':responsePing.packetLoss,
          });
    });

    await Promise.all(promises)

    if(showTable){
        const table = new Table({
            head: ['STATUS', 'IDENTIFIER', 'HOST', 'HTTP', 'PORT', 'PING', 'LOSS%'],
            colAligns: ["middle", "left", "left", "middle", "middle", "middle", "middle"]
        });
    
        results.filter(result => showOnlyErrors?result.isAlive===false:result.isAlive===result.isAlive).forEach(result => {
            table.push([result.isAlive?'✔':'✖', result.hostIdentifier, result.host, result.http, result.port, result.ping, result.packetLoss]);
        })

        console.log(table.toString());
    }

    return results;
}