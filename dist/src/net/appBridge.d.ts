import { App } from './usqApi';
export interface UsqToken {
    name: string;
    url: string;
    urlDebug: string;
    token: string;
}
export interface AppInFrame {
    hash: string;
    unit: number;
    page?: string;
    param?: string[];
}
export declare let meInFrame: AppInFrame;
export declare function isBridged(): boolean;
export declare function setMeInFrame(appHash: string): AppInFrame;
export declare function appUrl(url: string, unitId: number, page?: string, param?: any[]): {
    url: string;
    hash: string;
};
export declare function loadAppUsqs(appOwner: string, appName: any): Promise<App>;
export declare function appUsq(usq: string, usqOwner: string, usqName: string): Promise<UsqToken>;
export declare function bridgeCenterApi(url: string, method: string, body: any): Promise<any>;
