import { Form } from './form';
import { UiArr } from './uiSchema';
import { ArrSchema } from './schema';
export declare class ArrRow {
    readonly key: number;
    readonly form: Form;
    readonly arrSchema: ArrSchema;
    readonly uiArr: UiArr;
    readonly data: any;
    constructor(form: Form, arrSchema: ArrSchema, data: any);
}
