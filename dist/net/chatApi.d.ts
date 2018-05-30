import { ApiBase } from './apiBase';
import { HttpChannel } from './httpChannel';
export declare function logoutChatApis(): void;
export declare class ChatApi extends ApiBase {
    private unitId;
    constructor(unitId: number);
    protected getHttpChannel(): Promise<HttpChannel>;
    private buildChannel();
}
