/// <reference types="react" />
import * as React from 'react';
import { SubmitReturn } from '../ui';
export interface Props {
    logo: any;
}
export default class Login extends React.Component<Props> {
    private schema;
    onLoginSubmit(values: any): Promise<SubmitReturn | undefined>;
    click(): void;
    render(): JSX.Element;
}
