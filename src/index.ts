import axios from 'axios';
import * as ping from 'ping';
import Table from 'cli-table';

export interface IResults {
    isAlive: boolean,
    host: string,
    http: string,
    ping: boolean,
    packetLoss: string;
}

const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;

export const checkHosts = async (hosts: string[], showTable?: boolean, showOnlyErrors?: boolean): Promise<IResults[]> => {
    const results: IResults[] = [];

    const promises = hosts.map(async host => {
        try{
            const pingResponse = await ping.promise.probe(host.replace('http://', '').replace('https://', '').replace('www.', ''))
            const isValidUrl = urlRegex.test(host);
            let axiosResponse = null;
            if(isValidUrl){
                axiosResponse = await axios.get(host);
                results.push({ isAlive: pingResponse.alive, host, http: axiosResponse.status.toString(), ping: pingResponse.alive, packetLoss: `${pingResponse.packetLoss}`  })
            }else{
                results.push({ isAlive: pingResponse.alive, host, http: 'NOT VALID', ping: pingResponse.alive, packetLoss: `${pingResponse.packetLoss}`  })
            }
        }catch(err){
            console.log(err)
            const pingResponse = await ping.promise.probe(host)
            results.push({ isAlive: pingResponse.alive, host, http: err.code.toString(), ping: pingResponse.alive, packetLoss: `${pingResponse.packetLoss}` })
        }
    });

    await Promise.all(promises)

    const table = new Table({
        head: ['STATUS', 'HOST', 'HTTP', 'PING', 'LOSS%'],
        colAligns: ["middle", "left", "middle", "middle", "middle"]
    });

    results.filter(result => showOnlyErrors?result.isAlive===false:result.isAlive===result.isAlive).sort((a,b) => (b.isAlive - a.isAlive)).forEach(result => {
        table.push([result.isAlive?'✔':'✖', result.host, result.http, result.ping, result.packetLoss]);
    })

    if(showTable){
        console.clear();
        console.log(table.toString());
    }
    

    return results;
}