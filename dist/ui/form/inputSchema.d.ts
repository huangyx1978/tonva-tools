/// <reference types="react" />
import * as React from 'react';
import { Field } from './def';
import { FormSchema } from './formSchema';
export declare class Err extends React.Component<{
    err?: string;
}, {}> {
    render(): JSX.Element;
}
export declare type Validator = (values?: any) => string | undefined;
export declare abstract class InputSchema {
    props: any;
    id: string;
    label: string;
    err?: string;
    value: any;
    field: Field;
    inputTag: string;
    protected abstract setProps(): void;
    protected formSchema: FormSchema;
    protected validators: Validator[];
    constructor(formSchema: FormSchema, field: Field);
    reset(): void;
    clear(): void;
    protected buildValidators(): void;
    private buildValidator(rule);
    protected stringValidator(rule: string, param?: string): Validator | undefined;
    protected required(values?: any): string | undefined;
}
export declare function inputFactory(formSchema: FormSchema, field: Field): InputSchema;
