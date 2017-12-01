export interface FetchError {
    url: string;
    options: any;
    resolve: (value?: any) => void;
    reject: (reason?: any) => void;
    error: any;
}
