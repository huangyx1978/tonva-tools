/// <reference types="react" />
import * as React from 'react';
import { SubmitReturn } from '../ui';
export default class Login extends React.Component<{}, null> {
    private schema;
    onLoginSubmit(values: any): Promise<SubmitReturn | undefined>;
    click(): void;
    render(): JSX.Element;
}
