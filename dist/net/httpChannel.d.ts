import { HttpChannelUI } from './httpChannelUI';
export declare class HttpChannel {
    private hostUrl;
    private apiToken;
    private ui?;
    constructor(hostUrl: string, apiToken: string, ui?: HttpChannelUI);
    private startWait();
    private endWait();
    private showError(error);
    used(): void;
    get(url: string, params?: any): Promise<any>;
    post(url: string, params: any): Promise<any>;
    put(url: string, params: any): Promise<any>;
    delete(url: string, params: any): Promise<any>;
    fetch(url: string, options: any, resolve: (value?: any) => any, reject: (reason?: any) => void): Promise<void>;
    private innerFetch(url, options);
    private buildOptions();
}
