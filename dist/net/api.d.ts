import { ApiBase } from './apiBase';
import { HttpChannel } from './httpChannel';
export declare function logoutApis(): void;
export declare class Api extends ApiBase {
    apiOwner: string;
    apiName: string;
    api: string;
    constructor(basePath: string, apiOwner: any, apiName: string, showWaiting?: boolean);
    protected getHttpChannel(): Promise<HttpChannel>;
}
