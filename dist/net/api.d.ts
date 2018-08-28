import { HttpChannel } from './httpChannel';
import { ApiBase } from './apiBase';
export declare function logoutApis(): void;
export declare class Api extends ApiBase {
    apiOwner: string;
    apiName: string;
    api: string;
    constructor(basePath: string, apiOwner: any, apiName: string, showWaiting?: boolean);
    protected getHttpChannel(): Promise<HttpChannel>;
}
export declare function logoutUnitxApis(): void;
export declare class UnitxApi extends Api {
    private unitId;
    constructor(unitId: number);
    protected getHttpChannel(): Promise<HttpChannel>;
    private buildChannel;
}
export declare function setCenterUrl(url: string): void;
export declare function getCenterUrl(): string;
export declare let centerToken: string | undefined;
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
export interface App {
    id: number;
    apis: AppApi[];
}
export interface AppApi {
    id: number;
    apiOwner: string;
    apiName: string;
    url: string;
    urlDebug: string;
    ws: string;
    wsDebug: string;
    access: string;
    token: string;
}
export declare class CenterAppApi extends CenterApi {
    apis(unit: number, appOwner: string, appName: string): Promise<App>;
    unitxApi(unit: number): Promise<AppApi>;
}
//# sourceMappingURL=api.d.ts.map