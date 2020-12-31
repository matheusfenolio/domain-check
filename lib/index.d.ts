export interface IResults {
    isAlive: boolean;
    host: string;
    http: string;
    ping: boolean;
    packetLoss: string;
}
export declare const checkHosts: (hosts: string[], showTable?: boolean | undefined, showOnlyErrors?: boolean | undefined) => Promise<IResults[]>;
//# sourceMappingURL=index.d.ts.map