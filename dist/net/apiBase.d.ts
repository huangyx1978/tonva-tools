import { HttpChannel } from './httpChannel';
export declare abstract class ApiBase {
    private path;
    protected showWaiting: boolean;
    constructor(path: string, showWaiting: boolean);
    protected abstract getHttpChannel(): Promise<HttpChannel>;
    protected get(path: string, params: any): Promise<any>;
    protected post(path: string, params: any): Promise<any>;
    protected put(path: string, params: any): Promise<any>;
    protected delete(path: string, params: any): Promise<any>;
}
