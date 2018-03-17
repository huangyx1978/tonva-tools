import { ApiBase } from './apiBase';
import { HttpChannel } from './httpChannel';
export declare function logoutApis(): void;
export declare class Api extends ApiBase {
    url: string;
    apiOwner: string;
    apiName: string;
    api: string;
    constructor(path: string, url: string, apiOwner: any, apiName: string, showWaiting?: boolean);
    protected getHttpChannel(): Promise<HttpChannel>;
}
