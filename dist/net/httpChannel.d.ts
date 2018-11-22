import { HttpChannelUI } from './httpChannelUI';
export declare function httpGet(url: string, params?: any): Promise<any>;
export declare function httpPost(url: string, params?: any): Promise<any>;
export declare class HttpChannel {
    private isCenter;
    private hostUrl;
    private apiToken;
    private ui?;
    private timeout;
    constructor(isCenter: boolean, hostUrl: string, apiToken: string, ui?: HttpChannelUI);
    private startWait;
    private endWait;
    private showError;
    used(): void;
    get(url: string, params?: any): Promise<any>;
    post(url: string, params: any): Promise<any>;
    put(url: string, params: any): Promise<any>;
    delete(url: string, params: any): Promise<any>;
    fetch(url: string, options: any, resolve: (value?: any) => any, reject: (reason?: any) => void): Promise<void>;
    private innerFetch;
    callFetch(url: string, method: string, body: any): Promise<any>;
    private buildOptions;
}
