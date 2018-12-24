import * as React from 'react';
import { Context } from '../ui';
import '../css/va-form.css';
export interface Values {
    user: string;
    pwd: string;
    rePwd: string;
    country?: string;
    mobile?: string;
    email?: string;
}
export default class Register extends React.Component {
    private res;
    private uiSchema;
    onSubmit(name: string, context: Context): Promise<string>;
    click(): void;
    render(): JSX.Element;
}
