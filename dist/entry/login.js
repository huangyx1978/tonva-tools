import * as React from 'react';
import { Button } from 'reactstrap';
import { nav, Page, FormSchema } from '../ui';
import RegisterView from './register';
import Forget from './forget';
import userApi from './userApi';
import { ValidForm } from '..';
const logo = require('../img/logo.svg');
/*
export interface Values {
    username: string;
    password: string;
}

export interface State {
    values: Values;
    hasError: boolean;
    disabled: boolean;
}*/
export default class Login extends React.Component {
    constructor() {
        super(...arguments);
        this.schema = new FormSchema({
            fields: [
                {
                    type: 'string',
                    name: 'username',
                    placeholder: '用户名',
                    rules: ['required', 'maxlength:100']
                },
                {
                    type: 'password',
                    name: 'password',
                    placeholder: '密码',
                    rules: ['required', 'maxlength:100']
                },
            ],
            onSumit: this.onLoginSubmit.bind(this),
        });
    }
    async onLoginSubmit(values) {
        let un = values['username'];
        let pwd = values['password'];
        if (pwd === undefined) {
            alert('something wrong, pwd is undefined');
            return;
        }
        let user = await userApi.login({
            user: un,
            pwd: pwd
        });
        if (user === undefined) {
            //this.failed();
            this.schema.clear();
            this.schema.errors.push('用户名或密码错！');
        }
        else {
            console.log("onLoginSubmit: user=%s pwd:%s", user.name, user.token);
            await nav.logined(user);
        }
        return undefined;
    }
    click() {
        nav.replace(React.createElement(RegisterView, null));
    }
    render() {
        let footer = React.createElement("div", { className: 'text-center' },
            React.createElement(Button, { color: "link", style: { margin: '0px auto' }, onClick: () => nav.push(React.createElement(RegisterView, null)) }, "\u5982\u679C\u6CA1\u6709\u8D26\u53F7\uFF0C\u8BF7\u6CE8\u518C"));
        return React.createElement(Page, { header: false, footer: footer },
            React.createElement("div", { style: {
                    maxWidth: '400px',
                    margin: '20px auto',
                    padding: '0 30px',
                } },
                React.createElement("div", { className: 'container', style: { display: 'flex', position: 'relative' } },
                    React.createElement("img", { className: 'App-logo', src: logo, style: { height: '60px', position: 'absolute' } }),
                    React.createElement("span", { style: { flex: 1,
                            fontSize: 'x-large',
                            alignSelf: 'center',
                            textAlign: 'center',
                            margin: '10px',
                        } }, "\u540C\u82B1")),
                React.createElement("div", { style: { height: '20px' } }),
                React.createElement(ValidForm, { formSchema: this.schema })),
            React.createElement("div", { className: 'constainer' },
                React.createElement(Button, { color: "link", block: true, onClick: () => nav.push(React.createElement(Forget, null)) }, "\u5FD8\u8BB0\u5BC6\u7801")));
    }
}
//# sourceMappingURL=login.js.map