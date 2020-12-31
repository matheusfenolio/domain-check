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
exports.checkHosts = void 0;
const axios_1 = __importDefault(require("axios"));
const ping = __importStar(require("ping"));
const cli_table_1 = __importDefault(require("cli-table"));
const urlRegex = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
const checkHosts = async (hosts, showTable, showOnlyErrors) => {
    const results = [];
    const promises = hosts.map(async (host) => {
        try {
            const pingResponse = await ping.promise.probe(host.replace('http://', '').replace('https://', '').replace('www.', ''));
            const isValidUrl = urlRegex.test(host);
            let axiosResponse = null;
            if (isValidUrl) {
                axiosResponse = await axios_1.default.get(host);
                results.push({ isAlive: pingResponse.alive, host, http: axiosResponse.status.toString(), ping: pingResponse.alive, packetLoss: `${pingResponse.packetLoss}` });
            }
            else {
                results.push({ isAlive: pingResponse.alive, host, http: 'NOT VALID', ping: pingResponse.alive, packetLoss: `${pingResponse.packetLoss}` });
            }
        }
        catch (err) {
            console.log(err);
            const pingResponse = await ping.promise.probe(host);
            results.push({ isAlive: pingResponse.alive, host, http: err.code.toString(), ping: pingResponse.alive, packetLoss: `${pingResponse.packetLoss}` });
        }
    });
    await Promise.all(promises);
    const table = new cli_table_1.default({
        head: ['STATUS', 'HOST', 'HTTP', 'PING', 'LOSS%'],
        colAligns: ["middle", "left", "middle", "middle", "middle"]
    });
    results.filter(result => showOnlyErrors ? result.isAlive === false : result.isAlive === result.isAlive).sort((a, b) => (b.isAlive - a.isAlive)).forEach(result => {
        table.push([result.isAlive ? '✔' : '✖', result.host, result.http, result.ping, result.packetLoss]);
    });
    if (showTable) {
        console.clear();
        console.log(table.toString());
    }
    return results;
};
exports.checkHosts = checkHosts;
//# sourceMappingURL=index.js.map