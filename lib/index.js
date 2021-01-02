"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkHosts = exports.RequestType = exports.ResponseStatus = void 0;
const axios_1 = __importDefault(require("axios"));
const ping_1 = require("ping");
const cli_table3_1 = __importDefault(require("cli-table3"));
const lodash_1 = __importDefault(require("lodash"));
const httpStatusCode_1 = __importDefault(require("./httpStatusCode"));
const colors_1 = __importDefault(require("colors"));
const isPortReachable = require('is-port-reachable');
var ResponseStatus;
(function (ResponseStatus) {
    ResponseStatus["PASSED"] = "PASSED";
    ResponseStatus["ERROR"] = "ERROR";
    ResponseStatus["INVALID"] = "INVALID";
    ResponseStatus["SKIPPED"] = "SKIPPED";
})(ResponseStatus = exports.ResponseStatus || (exports.ResponseStatus = {}));
var RequestType;
(function (RequestType) {
    RequestType["GET"] = "GET";
    RequestType["POST"] = "POST";
    RequestType["DELETE"] = "DELETE";
    RequestType["PUT"] = "PUT";
    RequestType["PATCH"] = "PATCH";
})(RequestType = exports.RequestType || (exports.RequestType = {}));
const validateURL = (url) => {
    const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
    return urlRegex.test(url);
};
const requestHttp = async (host) => {
    if (host.bypassHttp) {
        return { isAlive: true, code: ResponseStatus.SKIPPED };
    }
    try {
        if (validateURL(host.host) || host.bypassUrlValidation) {
            const response = await axios_1.default({
                url: host.host,
                method: lodash_1.default.isNil(host.httpRequestType) ? RequestType.GET : host.httpRequestType,
                headers: host.header,
                data: host.body
            });
            return { isAlive: true, code: httpStatusCode_1.default(response.status) };
        }
        else {
            return { isAlive: false, code: ResponseStatus.INVALID };
        }
    }
    catch (err) {
        return { isAlive: false, code: lodash_1.default.isNil(err.code) ? httpStatusCode_1.default(err.response.status) : httpStatusCode_1.default(err.code) };
    }
};
const requestPing = async (host) => {
    if (host.bypassPing) {
        return { isAlive: true, code: ResponseStatus.SKIPPED, packetLoss: ResponseStatus.SKIPPED };
    }
    try {
        const response = await ping_1.promise.probe(host.host.replace('http://', '').replace('https://', '').replace('www.', ''));
        return {
            isAlive: response.alive,
            code: response.alive ? ResponseStatus.PASSED : ResponseStatus.ERROR,
            packetLoss: response.alive ? response.packetLoss : ResponseStatus.ERROR
        };
    }
    catch (err) {
        return { isAlive: false, code: ResponseStatus.ERROR, packetLoss: ResponseStatus.ERROR };
    }
};
const requestPort = async (host) => {
    if (host.bypassPort || lodash_1.default.isNil(host.port)) {
        return { isAlive: true, code: ResponseStatus.SKIPPED };
    }
    try {
        const response = await isPortReachable(host.port, { host: host.host.replace('http://', '').replace('https://', '').replace('www.', '') });
        return { isAlive: response, code: response ? ResponseStatus.PASSED : ResponseStatus.ERROR };
    }
    catch (err) {
        return { isAlive: false, code: ResponseStatus.ERROR };
    }
};
const isHostAlive = (host, http, ping, port) => {
    return http.isAlive && ping.isAlive && port.isAlive;
};
const checkHosts = async (hosts, showTable, showOnlyErrors) => {
    const results = [];
    const promises = hosts.map(async (hostObject) => {
        const responseHttp = await requestHttp(hostObject);
        const responsePing = await requestPing(hostObject);
        const responsePort = await requestPort(hostObject);
        results.push({
            isAlive: isHostAlive(hostObject, responseHttp, responsePing, responsePort),
            hostIdentifier: lodash_1.default.isNil(hostObject.identifier) ? hostObject.host : hostObject.identifier,
            host: hostObject.host,
            http: responseHttp.code,
            ping: responsePing.code,
            port: responsePort.code,
            packetLoss: lodash_1.default.isNil(responsePing.packetLoss) ? '0' : responsePing.packetLoss,
        });
    });
    await Promise.all(promises);
    if (showTable) {
        const table = new cli_table3_1.default({
            head: ['STATUS', 'IDENTIFIER', 'HOST', 'HTTP', 'PORT', 'PING', 'LOSS%'],
            colAligns: ["center", "left", "left", "center", "center", "center", "center"]
        });
        results.filter(result => showOnlyErrors ? result.isAlive === false : result.isAlive === result.isAlive).forEach(result => {
            table.push([
                result.isAlive ? colors_1.default.green('⏺') : colors_1.default.red('⏹'),
                result.hostIdentifier,
                result.host,
                result.http,
                result.port,
                result.ping,
                result.packetLoss
            ]);
        });
        console.log(table.toString());
    }
    return results;
};
exports.checkHosts = checkHosts;
//# sourceMappingURL=index.js.map