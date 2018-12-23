export declare type Rule = string | ((values: any) => string);
export declare type Rules = Rule[];
export declare type DataField = {
    type: 'int' | 'dec' | 'float' | 'string' | 'text' | 'password' | 'checkbox' | 'radios' | 'select' | 'pick-id';
    name: string;
    label?: string;
    placeholder?: string;
    rules?: Rules | Rule;
    defaultValue?: any;
    list?: string[] | {
        value: any;
        text: string;
    }[];
};
export interface SubmitReturn {
    success: boolean;
    message?: string;
    result?: any;
}
export declare type FormFields = {
    fields: DataField[];
    rules?: Rules;
    fieldTag?: string;
    submitText?: string;
    clearButton?: string | boolean;
    resetButton?: string | boolean;
    onSumit: (values: any) => Promise<SubmitReturn | undefined>;
};
