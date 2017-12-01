/// <reference types="react" />
import * as React from 'react';
import { FormSchema } from './formSchema';
export interface FormProps {
    formSchema: FormSchema;
}
export declare class ValidForm extends React.Component<FormProps, {}> {
    render(): JSX.Element;
}
