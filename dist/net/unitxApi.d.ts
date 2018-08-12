import { HttpChannel } from './httpChannel';
import { Api } from './api';
export declare function logoutUnitxApis(): void;
export declare class UnitxApi extends Api {
    private unitId;
    constructor(unitId: number);
    protected getHttpChannel(): Promise<HttpChannel>;
    private buildChannel;
}
