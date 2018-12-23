import * as React from 'react';
import { Form } from './form';
import { UiSchema, UiArr, UiItem } from './uiSchema';
import { ArrSchema, ItemSchema } from './schema';
import { Widget as Widget } from './widgets/widget';
import { ArrRow } from './arrRow';
import { ContextRule } from './rules';
export declare abstract class Context {
    readonly form: Form;
    readonly uiSchema: UiSchema;
    readonly data: any;
    readonly inNode: boolean;
    readonly widgets: {
        [name: string]: Widget;
    };
    readonly rules: ContextRule[];
    errors: string[];
    errorWidgets: Widget[];
    constructor(form: Form, uiSchema: UiSchema, data: any, inNode: boolean);
    abstract readonly isRow: boolean;
    abstract getItemSchema(itemName: string): ItemSchema;
    abstract getUiItem(itemName: string): UiItem;
    readonly arrName: string;
    getValue(itemName: string): any;
    setValue(itemName: string, value: any): void;
    getDisabled(itemName: string): boolean;
    setDisabled(itemName: string, value: boolean): void;
    getReadOnly(itemName: string): boolean;
    setReadOnly(itemName: string, value: boolean): void;
    getVisible(itemName: string): boolean;
    setVisible(itemName: string, value: boolean): void;
    checkFieldRules(): void;
    checkContextRules(): void;
    setError(itemName: string, error: string): void;
    clearContextErrors(): void;
    checkRules(): void;
    addErrorWidget(widget: Widget): void;
    removeErrorWidget(widget: Widget): void;
    protected checkHasError(): boolean;
    readonly hasError: boolean;
    removeErrors(): void;
    renderErrors: () => JSX.Element;
}
export declare class RowContext extends Context {
    readonly formContext: FormContext;
    readonly arrSchema: ArrSchema;
    readonly uiSchema: UiArr;
    readonly row: ArrRow;
    constructor(formContext: FormContext, arrSchema: ArrSchema, data: any, inNode: boolean, row: ArrRow);
    readonly isRow: boolean;
    getItemSchema(itemName: string): ItemSchema;
    getUiItem(itemName: string): UiItem;
    readonly arrName: string;
}
export declare class FormContext extends Context {
    rowContexts: {
        [name: string]: {
            [rowKey: string]: RowContext;
        };
    };
    constructor(form: Form, inNode: boolean);
    readonly isRow: boolean;
    getItemSchema(itemName: string): ItemSchema;
    getUiItem(itemName: string): UiItem;
    checkFieldRules(): void;
    checkContextRules(): void;
    readonly hasError: boolean;
}
export declare const ContextContainer: React.Context<Context>;
