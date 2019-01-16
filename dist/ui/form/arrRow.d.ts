import { ArrSchema } from './schema';
export declare class ArrRow {
    readonly key: number;
    readonly arrSchema: ArrSchema;
    readonly data: any;
    constructor(arrSchema: ArrSchema, data: any);
}
