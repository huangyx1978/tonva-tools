/// <reference types="react" />
import * as React from 'react';
import { SubmitReturn } from '../ui';
export interface Values {
    user: string;
    pwd: string;
    rePwd: string;
    country?: string;
    mobile?: string;
    email?: string;
}
export interface Props {
    logo: any;
}
export default class Register extends React.Component<Props> {
    private schema;
    onLoginSubmit(values: any): Promise<SubmitReturn | undefined>;
    click(): void;
    render(): JSX.Element;
}
