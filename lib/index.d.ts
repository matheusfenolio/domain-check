export declare enum RequestType {
    GET = "GET",
    POST = "POST",
    DELETE = "DELETE",
    PUT = "PUT",
    PATCH = "PATCH"
}
export interface IHost {
    host: string;
    identifier?: string;
    port?: number;
    httpRequestType?: RequestType;
    header?: object | null;
    body?: object | null;
    bypassHttp?: boolean;
    bypassPing?: boolean;
    bypassPort?: boolean;
}
export declare enum ResponseStatus {
    PASSED = "PASSED",
    ERROR = "ERROR",
    INVALID = "INVALID",
    SKIPPED = "SKIPPED"
}
export interface IResults {
    isAlive: boolean;
    hostIdentifier: string;
    host: string;
    http: string;
    ping: string;
    port: string;
    packetLoss: string;
}
export declare const checkHosts: (hosts: IHost[], showTable?: boolean | undefined, showOnlyErrors?: boolean | undefined) => Promise<IResults[]>;
//# sourceMappingURL=index.d.ts.map