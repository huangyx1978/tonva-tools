import * as React from 'react';
import { Schema, ItemSchema } from './schema';
import { UiSchema } from './uiSchema';
import 'font-awesome/css/font-awesome.min.css';
import { FormContext, Context } from './context';
export declare type FormButtonClick = (name: string, context: Context) => Promise<any>;
export interface FormProps {
    className?: string;
    schema: Schema;
    uiSchema?: UiSchema;
    formData?: any;
    onButtonClick?: FormButtonClick;
    Container?: (content: JSX.Element) => JSX.Element;
    FieldContainer?: (label: string | JSX.Element, content: JSX.Element) => JSX.Element;
    FieldClass?: string;
    ArrContainer?: (label: any, content: JSX.Element) => JSX.Element;
    RowContainer?: (content: JSX.Element) => JSX.Element;
    ButtonClass?: string;
    RowSeperator?: JSX.Element;
    fieldLabelSize?: 2;
    beforeShow?: (formContext: FormContext) => void;
}
export declare class Form extends React.Component<FormProps> {
    readonly schema: Schema;
    readonly itemSchemas: {
        [name: string]: ItemSchema;
    };
    readonly uiSchema: UiSchema;
    readonly Container: (content: JSX.Element) => JSX.Element;
    readonly FieldContainer: (label: any, content: JSX.Element) => JSX.Element;
    readonly FieldClass: string;
    readonly ArrContainer: (label: any, content: JSX.Element) => JSX.Element;
    readonly RowContainer: (content: JSX.Element) => JSX.Element;
    readonly ButtonClass: string;
    readonly RowSeperator: JSX.Element;
    protected formContext: FormContext;
    private content;
    readonly data: any;
    constructor(props: FormProps);
    componentDidMount(): void;
    render(): JSX.Element;
    protected DefaultContainer: (content: JSX.Element) => JSX.Element;
    protected DefaultFieldContainer: (label: string | JSX.Element, content: JSX.Element) => JSX.Element;
    protected DefaultFieldClass: string;
    protected DefaultArrContainer: (label: any, content: JSX.Element) => JSX.Element;
    protected DefaultRowContainer: (content: JSX.Element) => JSX.Element;
    protected DefaultButtonClass: string;
    protected DefaultRowSeperator: JSX.Element;
}
