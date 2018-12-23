import * as React from 'react';
import { DataField } from './field';
import { FormSchema } from './formSchema';
export declare class Err extends React.Component<{
    err?: string;
}, {}> {
    render(): JSX.Element;
}
export declare type Validator = (values?: any) => string | undefined;
export declare abstract class InputSchema {
    protected element: HTMLElement;
    props: any;
    id: string;
    label: string;
    err?: string;
    value: any;
    field: DataField;
    protected abstract setProps(): void;
    protected formSchema: FormSchema;
    protected validators: Validator[];
    protected parseValue(value: any): any;
    constructor(formSchema: FormSchema, field: DataField);
    protected ref(element: HTMLElement): void;
    reset(): void;
    clear(): void;
    protected readonly defaultValue: any;
    setInitValue(value: any): void;
    readonly filled: boolean;
    protected buildValidators(): void;
    private buildValidator;
    protected stringValidator(rule: string, param?: string): Validator | undefined;
    protected required(values?: any): string | undefined;
}
export declare function inputFactory(formSchema: FormSchema, field: DataField): InputSchema;
