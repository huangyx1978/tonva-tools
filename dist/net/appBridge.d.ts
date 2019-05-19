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
    predefinedUnit?: number;
}
export declare let appInFrame: AppInFrame;
export declare function isBridged(): boolean;
export declare function setAppInFrame(appHash: string): AppInFrame;
export declare function getExHashPos(): number;
export declare function getExHash(): string;
export declare function appUrl(url: string, unitId: number, page?: string, param?: any[]): {
    url: string;
    hash: string;
};
export declare function buildAppUq(uq: string, uqOwner: string, uqName: string): Promise<void>;
export declare function appUq(uq: string): UqToken;
export declare function bridgeCenterApi(url: string, method: string, body: any): Promise<any>;
