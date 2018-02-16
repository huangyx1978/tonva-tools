export interface ApiToken {
    name: string;
    url: string;
    token: string;
}
export interface AppInFrame {
    hash: string;
    unit: number;
    app: number;
}
export declare let meInFrame: AppInFrame;
export declare function setMeInFrame(appHash: string): AppInFrame;
export declare function appUrl(url: string, unitId: number, appId: number): {
    url: string;
    hash: string;
};
export declare function appApi(api: string, apiOwner: string, apiName: string): Promise<ApiToken>;
export declare function bridgeCenterApi(url: string, method: string, body: any): Promise<any>;
