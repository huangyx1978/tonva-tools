/// <reference types="react" />
import * as React from 'react';
import '../css/va-form.css';
export interface Values {
    username: string;
    password: string;
}
export interface State {
    values: Values;
    hasError: boolean;
    disabled: boolean;
}
export default class Login extends React.Component<{}, State> {
    private values;
    private inputUser;
    private inputPassword;
    private timeOut?;
    constructor(props: any);
    click(): void;
    inputChange(event: any): void;
    inputFocus(event: any): void;
    onSubmit(e: React.FormEvent<HTMLFormElement>): Promise<void>;
    private failed();
    render(): JSX.Element;
}
