import * as React from 'react';
import { User } from '../user';
export interface LoginProps {
    withBack?: boolean;
    callback?: (user: User) => Promise<void>;
    top?: any;
}
export default class Login extends React.Component<LoginProps> {
    private res;
    private uiSchema;
    private onSubmit;
    private onEnter;
    private clickReg;
    private clickForget;
    render(): JSX.Element;
}
