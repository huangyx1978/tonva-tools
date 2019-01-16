import * as React from 'react';
import { Schema, ItemSchema } from './schema';
import { UiSchema } from './uiSchema';
import 'font-awesome/css/font-awesome.min.css';
import { FormContext, Context } from './context';
import { FormRes } from './formRes';
export declare type FormButtonClick = (name: string, context: Context) => Promise<any>;
export interface FormProps {
    className?: string;
    schema: Schema;
    uiSchema?: UiSchema;
    formData?: any;
    onButtonClick?: FormButtonClick;
    fieldLabelSize?: number;
    requiredFlag?: boolean;
    beforeShow?: (formContext: FormContext) => void;
    res?: FormRes;
    Container?: (content: JSX.Element) => JSX.Element;
    FieldContainer?: (label: string | JSX.Element, content: JSX.Element) => JSX.Element;
    FieldClass?: string;
    ButtonClass?: string;
}
export declare class Form extends React.Component<FormProps> {
    readonly schema: Schema;
    readonly itemSchemas: {
        [name: string]: ItemSchema;
    };
    readonly uiSchema: UiSchema;
    readonly res?: FormRes;
    protected formContext: FormContext;
    private content;
    readonly data: any;
    readonly Container: (content: JSX.Element) => JSX.Element;
    readonly FieldContainer: (label: any, content: JSX.Element) => JSX.Element;
    readonly FieldClass: string;
    readonly ButtonClass: string;
    constructor(props: FormProps);
    private initData;
    private initDataItem;
    componentDidMount(): void;
    render(): JSX.Element;
    protected DefaultContainer: (content: JSX.Element) => JSX.Element;
    protected DefaultFieldContainer: (label: string | JSX.Element, content: JSX.Element) => JSX.Element;
    protected DefaultFieldClass: string;
    protected DefaultButtonClass: string;
    protected DefaultRes: FormRes;
    ArrContainer: (label: any, content: JSX.Element) => JSX.Element;
    RowContainer: (content: JSX.Element) => JSX.Element;
    RowSeperator: JSX.Element;
}
