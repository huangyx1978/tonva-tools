import { AppApi } from './centerApi';
export interface ApiToken {
    name: string;
    url: string;
    token: string;
}
export interface AppInFrame {
    hash: string;
    unit: number;
}
export declare let meInFrame: AppInFrame;
export declare function setMeInFrame(appHash: string): AppInFrame;
export declare function appUrl(url: string, unitId: number): {
    url: string;
    hash: string;
};
export declare function loadAppApis(appOwner: string, appName: any): Promise<AppApi[]>;
export declare function appApi(api: string, apiOwner: string, apiName: string): Promise<ApiToken>;
export declare function bridgeCenterApi(url: string, method: string, body: any): Promise<any>;
