/// <reference types="react" />
import * as React from 'react';
import { FormSchema } from './formSchema';
export interface FormProps {
    className?: string;
    formSchema: FormSchema;
}
export declare class ValidForm extends React.Component<FormProps, {}> {
    componentDidMount(): void;
    render(): JSX.Element;
}
