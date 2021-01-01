export declare enum RequestType {
    GET = "GET",
    POST = "POST",
    DELETE = "DELETE",
    PUT = "PUT",
    PATCH = "PATCH"
}
export interface IHost {
    name: string;
    host: string;
    port: number;
    httpRequestType: RequestType;
    header?: object;
    body?: object;
    bypassHttp?: boolean;
    bypassPing?: boolean;
    bypassPort?: boolean;
}
export interface IResults {
    isAlive: boolean;
    hostName: string;
    host: string;
    http: string | number;
    ping: boolean | string;
    port: boolean | string;
    packetLoss: string;
}
export declare const checkHosts: (hosts: IHost[], showTable?: boolean | undefined, showOnlyErrors?: boolean | undefined) => Promise<IResults[]>;
//# sourceMappingURL=index.d.ts.map