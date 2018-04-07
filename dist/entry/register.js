var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as React from 'react';
import { nav, Page, FormSchema, ValidForm } from '../ui';
import LoginView from './login';
import userApi from './userApi';
import RegSuccess from './regSuccess';
import '../css/va-form.css';
const logo = require('../img/logo.svg');
export default class Register extends React.Component {
    constructor() {
        super(...arguments);
        this.schema = new FormSchema({
            fields: [
                {
                    type: 'string',
                    name: 'user',
                    placeholder: '用户名',
                    rules: ['required', 'maxlength:100']
                },
                {
                    type: 'password',
                    name: 'pwd',
                    placeholder: '密码',
                    rules: ['required', 'maxlength:100']
                },
                {
                    type: 'password',
                    name: 'rePwd',
                    placeholder: '重复密码',
                    rules: ['required', 'maxlength:100']
                },
            ],
            submitText: '注册新用户',
            onSumit: this.onLoginSubmit.bind(this),
        });
    }
    onLoginSubmit(values) {
        return __awaiter(this, void 0, void 0, function* () {
            /*
            let user = await userApi.login({
                user: values['username'],
                pwd: values['password']
            });
            if (user === undefined) {
                //this.failed();
                this.schema.clear();
                this.schema.errors.push('用户名或密码错！');
            } else {
                nav.logined(user);
            }
            return undefined;*/
            //const {user, pwd, rePwd, country, mobile, email} = this.state.values;
            let { user, pwd, rePwd, country, mobile, email } = values;
            if (pwd !== rePwd) {
                this.schema.errors.push('密码不对，请重新输入密码！');
                this.schema.inputs['pwd'].clear();
                this.schema.inputs['rePwd'].clear();
                return undefined;
            }
            let ret = yield userApi.register({
                nick: undefined,
                user: user,
                pwd: pwd,
                country: undefined,
                mobile: undefined,
                email: undefined,
            });
            let msg;
            switch (ret) {
                default: throw 'unknown return';
                case 0:
                    nav.clear();
                    nav.show(React.createElement(RegSuccess, { user: user, pwd: pwd }));
                    return;
                case 1:
                    msg = '用户名 ' + user;
                    break;
                case 2:
                    msg = '手机号 +' + country + ' ' + mobile;
                    break;
                case 3:
                    msg = '电子邮件 ' + email;
                    break;
            }
            this.schema.errors.push(msg + ' 已经被注册过了');
            return undefined;
        });
    }
    click() {
        nav.replace(React.createElement(LoginView, null));
        //nav.replace(<RegisterView />);
    }
    render() {
        return React.createElement(Page, { header: '\u6CE8\u518C' },
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
                React.createElement(ValidForm, { formSchema: this.schema })));
    }
}
//# sourceMappingURL=register.js.map