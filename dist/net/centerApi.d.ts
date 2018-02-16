import { HttpChannel } from './httpChannel';
import { ApiBase } from './apiBase';
export declare function setCenterToken(t?: string): void;
export declare abstract class CenterApi extends ApiBase {
    constructor(path: string, showWaiting?: boolean);
    protected getHttpChannel(): Promise<HttpChannel>;
}
export declare class ApiTokenApi extends CenterApi {
    api(params: {
        unit: number;
        apiOwner: string;
        apiName: string;
    }): Promise<any>;
}
export declare const apiTokenApi: ApiTokenApi;
export declare class CallCenterApi extends CenterApi {
    directCall(url: string, method: string, body: any): Promise<any>;
}
export declare const callCenterapi: CallCenterApi;
