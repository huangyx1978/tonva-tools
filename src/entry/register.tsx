import * as React from 'react';
import { Container, Form, Button, Input } from 'reactstrap';
import * as classNames from 'classnames';
import {nav, Page, FormPage, FormSchema, SubmitReturn, ValidForm} from '../ui';
import LoginView from './login';
import userApi from './userApi';
import RegSuccess from './regSuccess';
import '../css/va-form.css';
const logo = require('../img/logo.svg');

export interface Values {
    user: string;
    pwd: string;
    rePwd: string;
    country?: string;
    mobile?: string;
    email?: string;
}

export default class Register extends React.Component {
    private schema:FormSchema = new FormSchema({
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

    async onLoginSubmit(values:any):Promise<SubmitReturn|undefined> {
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
        let {user, pwd, rePwd, country, mobile, email} = values;
        if (pwd !== rePwd) {
            this.schema.errors.push('密码不对，请重新输入密码！');
            this.schema.inputs['pwd'].clear();
            this.schema.inputs['rePwd'].clear();
            return undefined;
        }
        let ret = await userApi.register({
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
                nav.show(<RegSuccess user={user} pwd={pwd} />);
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
    }
    click() {
        nav.replace(<LoginView />);
        //nav.replace(<RegisterView />);
    }

    render() {
        return <Page header='注册'>
            <div style={{
                maxWidth:'400px',
                margin: '20px auto',
                padding: '0 30px',
            }}>
                <div className='container' style={{display:'flex', position:'relative'}}>
                    <img className='App-logo' src={logo} style={{height:'60px', position:'absolute'}}/>
                    <span style={{flex:1,
                        fontSize: 'x-large',
                        alignSelf: 'center',
                        textAlign: 'center',
                        margin: '10px',
                    }}>同花</span>
                </div>
                <div style={{height:'20px'}} />
                <ValidForm formSchema={this.schema}  />
            </div>
        </Page>;
    }
}
