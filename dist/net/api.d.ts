export declare function refetchApi(url: any, options: any, resolve: any, reject: any): void;
export declare abstract class ApiNav {
    private path;
    constructor(path: string);
    protected get(path: string, params: any): Promise<any>;
    protected post(path: string, params: any): Promise<any>;
    protected put(path: string, params: any): Promise<any>;
    protected delete(path: string, params: any): Promise<any>;
}
export declare abstract class Api {
    private path;
    constructor(path: string);
    protected get(path: string, params: any): Promise<any>;
    protected post(path: string, params: any): Promise<any>;
    protected put(path: string, params: any): Promise<any>;
    protected delete(path: string, params: any): Promise<any>;
}
