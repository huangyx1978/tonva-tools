export declare const isDevelopment: boolean;
declare class Host {
    url: string;
    ws: string;
    resHost: string;
    start(): Promise<void>;
    private debugHostUrl;
    private tryLocal;
    private getCenterHost;
    private getResHost;
    getUrlOrDebug(url: string, urlDebug: string): string;
}
export declare const host: Host;
export {};
