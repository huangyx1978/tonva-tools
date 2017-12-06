
export type Rule = string|((values:any)=>string);
export type Rules = Rule[];
export type Field = {
    type:'int'|'dec'|'float'|'string'|'text'|'password';
    name:string;
    label?:string;
    placeholder?:string;
    rules?:Rules|Rule;
};
export interface SubmitReturn {
    success: boolean;
    message?: string
    result?: any;
}
export type FormFields = {
    fields: Field[];
    rules?: Rules;
    fieldTag?: string;
    submitText?: string;
    clearButton?: string|boolean;
    resetButton?: string|boolean;
    onSumit: (values:any) => Promise<SubmitReturn|undefined>;
}
