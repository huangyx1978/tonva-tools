/// <reference types="react" />
import * as React from 'react';
import '../css/va-form.css';
export interface Values {
    user: string;
    pwd: string;
    rePwd: string;
    country?: string;
    mobile?: string;
    email?: string;
}
export interface Props {
}
export interface State {
    values: Values;
    disabled: boolean;
    pwdError: boolean;
    regError: string;
}
export default class Register extends React.Component<Props, State> {
    private values;
    private timeOut;
    constructor(props: Props);
    click(): void;
    submit(): boolean;
    timeOutError(): void;
    inputChange(event: any): void;
    inputFocus(e: any): void;
    render(): JSX.Element;
    private errorClass(error);
}
