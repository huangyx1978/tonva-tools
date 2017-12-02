export interface ApiToken {
    url: string;
    token: string;
}
export declare function setAppHash(hash: string): void;
export declare function appUrl(url: string, unitId: number, appId: number): string;
export declare function appApi(apiName: string): Promise<ApiToken>;
