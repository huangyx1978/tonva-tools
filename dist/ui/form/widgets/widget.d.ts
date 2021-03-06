import * as React from 'react';
import { UiItem } from '../../schema';
import { FieldProps } from '../field';
import { Context } from '../context';
import { ItemSchema } from '../../schema';
import { Rule } from '../rules';
export declare abstract class Widget {
    protected name: string;
    protected context: Context;
    protected fieldProps: FieldProps;
    protected children: React.ReactNode;
    protected itemSchema: ItemSchema;
    protected ui: UiItem;
    protected defaultValue: any;
    protected value: any;
    protected rules: Rule[];
    protected errors: string[];
    protected contextErrors: string[];
    protected readonly hasError: boolean;
    protected readOnly: boolean;
    protected disabled: boolean;
    visible: boolean;
    constructor(context: Context, itemSchema: ItemSchema, fieldProps: FieldProps, children: React.ReactNode);
    protected init(): void;
    protected buildRules(): void;
    checkRules(): void;
    readonly isOk: boolean;
    setError(err: string | string[]): void;
    setContextError(err: string | string[]): void;
    clearError(): void;
    clearContextError(): void;
    protected parse(value: any): any;
    protected setElementValue(value: any): void;
    protected setDataValue(value: any): void;
    setValue(value: any): void;
    getValue(): any;
    getReadOnly(): boolean;
    getDisabled(): boolean;
    getVisible(): boolean;
    setReadOnly(value: boolean): void;
    setDisabled(value: boolean): void;
    setVisible(value: boolean): void;
    private isChanging;
    protected onInputChange: (evt: React.ChangeEvent<any>) => void;
    protected changeValue(newValue: any, fromElement: boolean): void;
    protected readonly className: string;
    protected abstract render(): JSX.Element;
    container: () => JSX.Element;
    protected readonly label: string;
    protected renderTemplet(): JSX.Element | undefined;
    protected renderErrors(): React.ReactElement<{
        key: string;
        className: string;
    }>[];
}
