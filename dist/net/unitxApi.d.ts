import { ApiBase } from './apiBase';
import { HttpChannel } from './httpChannel';
export declare function logoutUnitxApis(): void;
export declare class UnitxApi extends ApiBase {
    private unitId;
    constructor(unitId: number);
    protected getHttpChannel(): Promise<HttpChannel>;
    private buildChannel;
}
