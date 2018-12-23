import * as React from 'react';
//import {Form, Input, Container, Button, Row, Col} from 'reactstrap';
//import * as classNames from 'classnames';
//import {User} from '../user';
import {nav, Page, Form, Schema, UiSchema, UiTextItem, UiPasswordItem, Context, UiButton} from '../ui';
//ValidForm, FormSchema, 

import RegisterView from './register';
//import RegisterSuccess from './regSuccess';
import Forget from './forget';
import userApi from './userApi';
//import { ValidForm } from '..';

const logo = require('../img/logo.svg');

const schema: Schema = [
    {name: 'username', type: 'string', required: true},
    {name: 'password', type: 'string', required: true},
    {name: 'login', type: 'submit'},
]

const uiSchema: UiSchema = {
    items: {
        username: {placeholder: '用户名', maxLength: 100, label: '用户名'} as UiTextItem, 
        password: {widget: 'password', placeholder: '密码', maxLength: 100, label: '密码'} as UiPasswordItem,
        login: {widget: 'button', className: 'btn btn-primary', label: '登录'} as UiButton,
    }
}

export default class Login extends React.Component<{withBack?:boolean}> {
    /*
    private schema:FormSchema = new FormSchema({
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
    */

    private onLoginSubmit = async (name:string, context:Context):Promise<string> => {
        let values = context.form.data;
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
        if (user === undefined) return '用户名或密码错！';
        console.log("onLoginSubmit: user=%s pwd:%s", user.name, user.token);
        await nav.logined(user);
    }
    click() {
        nav.replace(<RegisterView />);
    }
    render() {
        let footer = <div className='text-center'>
            <button className="btn btn-link" color="link" style={{margin:'0px auto'}}
                onClick={() => nav.push(<RegisterView />)}>
                如果没有账号，请注册
            </button>
        </div>;
        let header:string|boolean|JSX.Element = false;
        let top = '同花';
        if (this.props.withBack === true) {
            header = '登录';
            top = '登录用户';
        }
        return <Page header={header} footer={footer}>
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
                    }}>{top}</span>
                </div>
                <div style={{height:'20px'}} />
                <Form schema={schema} uiSchema={uiSchema} onButtonClick={this.onLoginSubmit} />
            </div>
            <div className='constainer'>
                <button className="btn btn-link btn-block"
                    onClick={() => nav.push(<Forget />)}>
                    忘记密码
                </button>
            </div>
        </Page>;
    }
}
