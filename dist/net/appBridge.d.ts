import { App } from './uqApi';
export interface UqToken {
    name: string;
    url: string;
    urlDebug: string;
    token: string;
}
export declare function logoutUqTokens(): void;
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
export declare function loadAppUqs(appOwner: string, appName: any): Promise<App>;
export declare function appUq(uq: string, uqOwner: string, uqName: string): Promise<UqToken>;
export declare function bridgeCenterApi(url: string, method: string, body: any): Promise<any>;
