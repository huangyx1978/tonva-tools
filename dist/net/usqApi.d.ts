import { HttpChannel } from './httpChannel';
import { ApiBase } from './apiBase';
export declare function logoutApis(): void;
export declare class UsqApi extends ApiBase {
    private access;
    usqOwner: string;
    usqName: string;
    usq: string;
    constructor(basePath: string, usqOwner: any, usqName: string, access: string[], showWaiting?: boolean);
    protected getHttpChannel(): Promise<HttpChannel>;
    update(): Promise<string>;
    loadAccess(): Promise<any>;
    schema(name: string): Promise<any>;
    schemas(names: string[]): Promise<any[]>;
    tuidGet(name: string, id: number): Promise<any>;
    tuidGetAll(name: string): Promise<any[]>;
    tuidSave(name: string, params: any): Promise<any>;
    tuidSearch(name: string, arr: string, owner: number, key: string, pageStart: string | number, pageSize: number): Promise<any>;
    tuidArrGet(name: string, arr: string, owner: number, id: number): Promise<any>;
    tuidArrGetAll(name: string, arr: string, owner: number): Promise<any[]>;
    tuidArrSave(name: string, arr: string, owner: number, params: any): Promise<any>;
    tuidArrPos(name: string, arr: string, owner: number, id: number, order: number): Promise<any>;
    tuidBindSlaveSave(name: string, slave: any, params: any): Promise<any>;
    tuidBindSlaves(name: string, slave: string, masterId: number, order: number, pageSize: number): Promise<any>;
    tuidIds(name: string, arr: string, ids: number[]): Promise<any[]>;
    proxied(name: string, proxy: string, id: number): Promise<any>;
    sheetSave(name: string, data: object): Promise<any>;
    sheetAction(name: string, data: object): Promise<any>;
    stateSheets(name: string, data: object): Promise<any>;
    stateSheetCount(name: string): Promise<any>;
    getSheet(name: string, id: number): Promise<any>;
    sheetArchives(name: string, data: object): Promise<any>;
    sheetArchive(name: string, id: number): Promise<any>;
    action(name: string, data: object): Promise<any>;
    queryPage(queryApi: string, name: string, pageStart: any, pageSize: number, params: any): Promise<string>;
    query(name: string, params: any): Promise<any>;
    user(): Promise<any>;
}
export declare function logoutUnitxApis(): void;
export declare class UnitxApi extends UsqApi {
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
export declare class UsqTokenApi extends CenterApi {
    usq(params: {
        unit: number;
        usqOwner: string;
        usqName: string;
    }): Promise<any>;
}
export declare const usqTokenApi: UsqTokenApi;
export declare class CallCenterApi extends CenterApi {
    directCall(url: string, method: string, body: any): Promise<any>;
}
export declare const callCenterapi: CallCenterApi;
export interface App {
    id: number;
    usqs: AppUsq[];
}
export interface AppUsq {
    id: number;
    usqOwner: string;
    usqName: string;
    url: string;
    urlDebug: string;
    ws: string;
    wsDebug: string;
    access: string;
    token: string;
}
export declare class CenterAppApi extends CenterApi {
    usqs(unit: number, appOwner: string, appName: string): Promise<App>;
    unitxUsq(unit: number): Promise<AppUsq>;
}
//# sourceMappingURL=usqApi.d.ts.map