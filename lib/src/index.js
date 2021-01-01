"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkHosts = exports.RequestType = void 0;
const axios_1 = __importDefault(require("axios"));
const ping = __importStar(require("ping"));
const cli_table_1 = __importDefault(require("cli-table"));
const isPortReachable = require('is-port-reachable');
var RequestType;
(function (RequestType) {
    RequestType["GET"] = "GET";
    RequestType["POST"] = "POST";
    RequestType["DELETE"] = "DELETE";
    RequestType["PUT"] = "PUT";
    RequestType["PATCH"] = "PATCH";
})(RequestType = exports.RequestType || (exports.RequestType = {}));
const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
const checkHosts = async (hosts, showTable, showOnlyErrors) => {
    const results = [];
    const promises = hosts.map(async (hostObject) => {
        if (hostObject.bypassHttp && hostObject.bypassPing) {
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
        if (!hostObject.bypassPing) {
            try {
                pingResponse = await ping.promise.probe(host.replace('http://', '').replace('https://', '').replace('www.', ''));
                isAlivePing = pingResponse.alive;
            }
            catch (err) {
                console.error(err);
            }
        }
        if (!isValidUrl) {
            axiosResponse = { status: 'NOT VALID' };
        }
        else if (!hostObject.bypassHttp) {
            try {
                axiosResponse = await axios_1.default({
                    url: hostObject.host,
                    method: hostObject.httpRequestType,
                    headers: hostObject.header,
                    data: hostObject.body
                });
                isAliveHttp = true;
            }
            catch (err) {
                axiosError = err.code ? err.code : err.response.status;
            }
        }
        if (!hostObject.bypassPort) {
            isAlivePort = await isPortReachable(hostObject.port, { host: host.replace('http://', '').replace('https://', '').replace('www.', '') });
        }
        results.push({
            isAlive: isAlivePing && isAliveHttp && isAlivePort ? isAlivePort : false,
            hostName: hostObject.name,
            host: hostObject.host,
            http: hostObject.bypassHttp ? 'SKIPED' : axiosResponse !== undefined && axiosResponse !== null ? axiosResponse.status : axiosError,
            ping: hostObject.bypassPing ? 'SKIPED' : isAlivePing ? '✔' : '✖',
            port: hostObject.bypassPort ? 'SKIPED' : isAlivePort ? '✔' : '✖',
            packetLoss: hostObject.bypassPing ? '' : `${pingResponse ? pingResponse.packetLoss : 'NO INFO'}`,
        });
    });
    await Promise.all(promises);
    const table = new cli_table_1.default({
        head: ['STATUS', 'NAME', 'HOST', 'HTTP', 'PORT', 'PING', 'LOSS%'],
        colAligns: ["middle", "left", "left", "middle", "middle", "middle", "middle"]
    });
    results.filter(result => showOnlyErrors ? result.isAlive === false : result.isAlive === result.isAlive).sort((a, b) => (b.isAlive - a.isAlive)).forEach(result => {
        table.push([result.isAlive ? '✔' : '✖', result.hostName, result.host, result.http, result.port, result.ping, result.packetLoss]);
    });
    if (showTable) {
        // console.clear();
        console.log(table.toString());
    }
    return results;
};
exports.checkHosts = checkHosts;
const host = [
    {
        name: 'Google',
        host: 'https://google.com',
        port: 80,
        httpRequestType: RequestType.GET,
    },
    {
        name: 'Google',
        host: 'https://google.com',
        port: 80,
        httpRequestType: RequestType.GET,
        header: {
            user: 'user'
        },
        body: { message: 'hello' },
    },
    {
        name: 'Google',
        host: 'https://google.com',
        port: 21,
        httpRequestType: RequestType.GET,
        header: {
            user: 'user'
        },
        body: { message: 'hello' },
    }
];
exports.checkHosts(host, true);
//# sourceMappingURL=index.js.map