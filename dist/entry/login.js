var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as React from 'react';
import { Button } from 'reactstrap';
import { nav, Page, FormSchema } from '../ui';
import RegisterView from './register';
import Forget from './forget';
import userApi from './userApi';
import { ValidForm } from '../index';
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
    onLoginSubmit(values) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield userApi.login({
                user: values['username'],
                pwd: values['password']
            });
            console.log("onLoginSubmit: user=%s pwd:%s", user.name, user.token);
            if (user === undefined) {
                //this.failed();
                this.schema.clear();
                this.schema.errors.push('用户名或密码错！');
            }
            else {
                yield nav.logined(user);
            }
            return undefined;
        });
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