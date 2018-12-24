import { KeyValueRes, Res } from '../res';
export interface FormRes extends KeyValueRes {
    required: string;
    number: string;
    integer: string;
    min: string;
    max: string;
}
export declare const formRes: Res<FormRes>;
