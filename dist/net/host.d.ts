export declare const isDevelopment: boolean;
declare class Host {
    url: string;
    ws: string;
    start(): Promise<void>;
    private debugHostUrl;
    private tryLocal;
    private getCenterHost;
    getUrlOrDebug(url: string, urlDebug: string): string;
}
export declare const host: Host;
export {};
