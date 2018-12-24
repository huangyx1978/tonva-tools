export interface KeyValueRes {
    [key: string]: any;
}
export interface Res<T extends KeyValueRes> {
    [lang: string]: T | {
        [district: string]: T;
    };
}
export declare const resOptions: {
    lang: string;
    district: string;
};
export declare function setResOptions(lang: string, district: string): void;
export declare function resLang<T extends KeyValueRes>(res: Res<T>): T;
