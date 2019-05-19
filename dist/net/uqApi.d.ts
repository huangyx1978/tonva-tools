import { HttpChannel } from './httpChannel';
import { ApiBase } from './apiBase';
export declare function logoutApis(): void;
export declare class UqApi extends ApiBase {
    private access;
    uqOwner: string;
    uqName: string;
    uq: string;
    constructor(basePath: string, uqOwner: string, uqName: string, access: string[], showWaiting?: boolean);
    init(): Promise<void>;
    protected getHttpChannel(): Promise<HttpChannel>;
    update(): Promise<string>;
    __loadAccess(): Promise<any>;
    loadAccess(): Promise<any>;
    loadEntities(): Promise<any>;
    checkAccess(): Promise<boolean>;
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
    tuidIds(name: string, arr: string, ids: number[]): Promise<any[]>;
    proxied(name: string, proxy: string, id: number): Promise<any>;
    sheetSave(name: string, data: object): Promise<any>;
    sheetAction(name: string, data: object): Promise<any>;
    stateSheets(name: string, data: object): Promise<any>;
    stateSheetCount(name: string): Promise<any>;
    mySheets(name: string, data: object): Promise<any>;
    getSheet(name: string, id: number): Promise<any>;
    sheetArchives(name: string, data: object): Promise<any>;
    sheetArchive(name: string, id: number): Promise<any>;
    action(name: string, data: object): Promise<any>;
    page(name: string, pageStart: any, pageSize: number, params: any): Promise<string>;
    query(name: string, params: any): Promise<any>;
    user(): Promise<any>;
}
export declare function logoutUnitxApis(): void;
export declare class UnitxApi extends UqApi {
    private unitId;
    constructor(unitId: number);
    protected getHttpChannel(): Promise<HttpChannel>;
    private buildChannel;
}
export declare function setCenterUrl(url: string): void;
export declare let centerToken: string | undefined;
export declare function setCenterToken(userId: number, t?: string): void;
export declare abstract class CenterApi extends ApiBase {
    constructor(path: string, showWaiting?: boolean);
    protected getHttpChannel(): Promise<HttpChannel>;
}
export declare class UqTokenApi extends CenterApi {
    private local;
    uq(params: {
        unit: number;
        uqOwner: string;
        uqName: string;
    }): Promise<any>;
}
export declare const uqTokenApi: UqTokenApi;
export declare class CallCenterApi extends CenterApi {
    directCall(url: string, method: string, body: any): Promise<any>;
}
export declare const callCenterapi: CallCenterApi;
export interface App {
    id: number;
    uqs: AppUq[];
}
export interface AppUq {
    id: number;
    uqOwner: string;
    uqName: string;
    access: string;
}
export interface UqService {
    id: number;
    url: string;
    urlDebug: string;
    token: string;
}
export declare class CenterAppApi extends CenterApi {
    private cachedUqs;
    uqs(appOwner: string, appName: string): Promise<App>;
    private uqsPure;
    checkUqs(appOwner: string, appName: string): Promise<boolean>;
    unitxUq(unit: number): Promise<UqService>;
    changePassword(param: {
        orgPassword: string;
        newPassword: string;
    }): Promise<any>;
}
export declare function loadAppUqs(appOwner: string, appName: string): Promise<App>;
