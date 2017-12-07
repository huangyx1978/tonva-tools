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
    /*
    private values: Values = {
        username: '',
        password: '',
    };
    private inputUser: HTMLInputElement;
    private inputPassword: HTMLInputElement;
    private timeOut?: NodeJS.Timer;

    constructor(props) {
        super(props);
        this.state = {
            values: this.values,
            hasError: false,
            disabled: true,
        };
        this.onSubmit = this.onSubmit.bind(this);
    }
    */
    onLoginSubmit(values) {
        return __awaiter(this, void 0, void 0, function* () {
            let user = yield userApi.login({
                user: values['username'],
                pwd: values['password']
            });
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
    /*
    inputChange(event: any) {
        const target = event.target;
        const inputValue = target.type === 'checkbox' ? target.checked : target.value;
        const inputName = target.name;
        this.values[inputName] = inputValue;
        let {username, password} =  this.values;
        let disabled = username.trim().length===0 || password.length===0;
        this.setState({
            values: this.values,
            disabled: disabled,
        });
    }
    inputFocus(event: any) {
        this.setState({hasError: false});
        if (this.timeOut !== undefined) {
            clearTimeout(this.timeOut);
            this.timeOut = undefined;
        }
    }*/
    /*
    submit() {
        let {username, password} = this.values;
        userApi.login({
            user: username,
            pwd: password
        }).then(user => {
            if (user === undefined) {
                this.failed();
            } else {
                app.logined(user);
                // this.succeed(user);
            }
        });
        return false;
    }*/
    /*
    async onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        let {username, password} = this.values;
        let user = await userApi.login({
            user: username,
            pwd: password
        });
        if (user === undefined) {
            //this.failed();
            this.schema.clear();
        } else {
            nav.logined(user);
            // this.succeed(user);
        }
    }
    private failed() {
        this.values.username = '';
        this.values.password = '';
        this.setState({
            values: this.values,
            hasError: true,
            disabled: true,
        });
        this.timeOut = global.setTimeout(
            () => {
                this.setState({hasError: false});
                global.clearTimeout(this.timeOut);
                this.timeOut = undefined;
            },
            3000);
    }
    */
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
        /*
                let {hasError, values, disabled} = this.state;
                let {username, password} = values;
                let footer = <div className='text-center'>
                    <Button color="link" style={{margin:'0px auto'}}
                        onClick={() => nav.push(<RegisterView />)}>
                        如果没有账号，请注册
                    </Button>
                </div>;
        
                return (<Page header={false} footer={footer}>
                <Container className='entry-form'>
                    <Form onSubmit={this.onSubmit}>
                        <header>
                            <img className='App-logo' src={logo} />
                            <span>同花</span>
                        </header>
                        <Input type='text' placeholder="用户名..."
                            name='username'
                            value={username}
                            onChange={e => this.inputChange(e)}
                            onFocus={e => this.inputFocus(e)} />
                        <Input type='password' placeholder="密码..."
                            name='password'
                            value={password}
                            onChange={e => this.inputChange(e)}
                            onFocus={e => this.inputFocus(e)} />
                        <span className={classNames(hasError===false? 'hidden-xs-up':undefined)}>用户名或密码错！</span>
                        <Button
                            type='submit'
                            disabled={disabled}
                            block={true}
                            color='success'>登录</Button>
                        <div style={{display:'flex', alignItems:'center'}}>
                            <Button color="link" block={true}
                                onClick={() => nav.push(<Forget />)}>
                                忘记密码
                            </Button>
                        </div>
                    </Form>
                </Container>
                </Page>
                );
        */
    }
}
/*
<Container>
<div className="row">
    <div className="col-sm-12 col-sm-offset-3 form-box">
        <div className="form-bottom">
            <form role="form" action="" method="post" className="login-form">
                <div className="form-group">
                    <label className="sr-only" htmlFor="form-username"
                        style={{color: 'black'}}>Username</label>
                    <input ref={input => this.inputUser = input}
                        type="text" name="username"
                        placeholder="用户名..."
                        className="form-username form-control" id="form-username"
                        onChange={e => this.inputChange(e)}
                        onFocus={e => this.inputFocus(e)}
                        value={this.state.username} />
                </div>
                <div className="form-group">
                    <label className="sr-only" htmlFor="form-password">密码</label>
                    <input ref={input => this.inputPassword = input}
                        type="password" name="password"
                        placeholder="密码..."
                        className="form-password form-control" id="form-password"
                        onChange={e => this.inputChange(e)}
                        onFocus={e => this.inputFocus(e)}
                        value={this.state.password} />
                </div>
                <button type="button" className="btn btn-success"
                    onClick={() => this.submit()}>登录</button>
                {
                    this.state.errorUserOrPassword ?
                    (
                        <div style={{color: 'red', marginTop: '8px'}}>
                            用户名或密码错！
                        </div>
                    ) : undefined
                }
            </form>
        </div>
    </div>
</div>

<div className="row">
    <div className="col-sm-6 col-sm-offset-3">
        <button type="button" className="btn btn-link center-block"
            onClick={() => {nav.replace(<RegisterView />); }}>注册新账户</button>
    </div>
</div>

<div className="row">
    <div className="col-sm-6 col-sm-offset-3 social-login">
        <div style={{color: 'black'}}>或者用下面方式登录:</div>
        <div className="social-login-buttons">
            <a className="btn btn-link-1 btn-link-1-facebook" href="#">
                <i className="fa fa-facebook" />
            </a>
            <a className="btn btn-link-1 btn-link-1-twitter" href="#">
                <i className="fa fa-twitter" />
            </a>
            <a className="btn btn-link-1 btn-link-1-google-plus" href="#">
                <i className="fa fa-google-plus" />
            </a>
        </div>
    </div>
</div>
</Container>
</div>
*/ 
//# sourceMappingURL=login.js.map