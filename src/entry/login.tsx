import * as React from 'react';
import {Form, Input, Container, Button, Row, Col} from 'reactstrap';
import * as classNames from 'classnames';
import {User} from '../user';
import {nav, Page, FormPage, FormSchema, SubmitReturn} from '../ui';
import RegisterView from './register';
import RegisterSuccess from './regSuccess';
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
export default class Login extends React.Component<{withBack?:boolean}> {
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

    async onLoginSubmit(values:any):Promise<SubmitReturn|undefined> {
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
        } else {
            console.log("onLoginSubmit: user=%s pwd:%s", user.name, user.token);
            await nav.logined(user);
        }
        return undefined;
    }
    click() {
        nav.replace(<RegisterView />);
    }
    render() {
        let footer = <div className='text-center'>
            <Button color="link" style={{margin:'0px auto'}}
                onClick={() => nav.push(<RegisterView />)}>
                如果没有账号，请注册
            </Button>
        </div>;
        let header:string|boolean|JSX.Element = false;
        debugger;
        if (this.props.withBack === true) {
            header = '登录';
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
                    }}>同花</span>
                </div>
                <div style={{height:'20px'}} />
                <ValidForm formSchema={this.schema} />
            </div>
            <div className='constainer'>
                <Button color="link" block={true}
                    onClick={() => nav.push(<Forget />)}>
                    忘记密码
                </Button>
            </div>
        </Page>;
    }
}
