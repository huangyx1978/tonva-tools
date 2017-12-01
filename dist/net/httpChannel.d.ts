import { FetchError } from '../fetchError';
export declare function setToken(t?: string): void;
export interface HttpChannelUI {
    startWait(): void;
    endWait(): void;
    showError(error: FetchError): void;
}
export declare class HttpChannel {
    private ui?;
    constructor(ui?: HttpChannelUI);
    private startWait();
    private endWait();
    private showError(error);
    used(): void;
    get(url: string, params?: any): Promise<any>;
    post(url: string, params: any): Promise<any>;
    put(url: string, params: any): Promise<any>;
    delete(url: string, params: any): Promise<any>;
    fetch(url: string, options: any, resolve: (value?: any) => any, reject: (reason?: any) => void): Promise<any>;
    private innerFetch(url, options);
    private buildOptions();
}
