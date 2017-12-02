import * as React from 'react';
import { Container, Form, Button, Input } from 'reactstrap';
import { nav, Page } from '../ui';
import LoginView from './login';
import userApi from './userApi';
import RegSuccess from './regSuccess';
import '../css/va-form.css';
export default class Register extends React.Component {
    constructor(props) {
        super(props);
        this.values = {
            user: '',
            pwd: '',
            rePwd: '',
        };
        this.state = {
            values: this.values,
            disabled: true,
            pwdError: false,
            regError: undefined,
        };
    }
    click() {
        nav.replace(React.createElement(LoginView, null));
    }
    submit() {
        const { user, pwd, rePwd, country, mobile, email } = this.state.values;
        if (pwd !== rePwd) {
            this.setState({
                pwdError: true,
            });
            this.timeOutError();
            return false;
        }
        userApi.register({
            nick: undefined,
            user: user,
            pwd: pwd,
            country: undefined,
            mobile: undefined,
            email: undefined,
        }).then(ret => {
            let msg;
            switch (ret) {
                default: throw 'unknown return';
                case 0:
                    nav.clear();
                    nav.show(React.createElement(RegSuccess, { user: user, pwd: pwd }));
                    return;
                case 1:
                    msg = '用户名 ' + user + ' ';
                    break;
                case 2:
                    msg = '手机号 +' + country + ' ' + mobile + ' ';
                    break;
                case 3:
                    msg = '电子邮件 ' + email + ' ';
                    break;
            }
            this.setState({
                regError: msg + '已经被注册过了',
            });
            this.timeOutError();
        });
        return false;
    }
    timeOutError() {
        this.timeOut = global.setTimeout(() => {
            this.setState({
                pwdError: false,
                regError: undefined,
            });
            global.clearTimeout(this.timeOut);
            this.timeOut = undefined;
        }, 3000);
    }
    inputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.values[name] = value;
        if (name === 'pwd') {
            this.values.rePwd = '';
        }
        let { user, pwd, rePwd } = this.values;
        this.setState({
            values: this.values,
            disabled: user.trim().length === 0 || pwd.length === 0 || rePwd.length === 0,
        });
    }
    inputFocus(e) {
        this.setState({
            pwdError: false,
            regError: undefined,
        });
    }
    render() {
        let { values, disabled, pwdError, regError } = this.state;
        let { user, pwd, rePwd } = values;
        return (React.createElement(Page, { header: "注册" },
            React.createElement(Container, { className: "entry-form" },
                React.createElement(Form, null,
                    React.createElement(Input, { type: "text", placeholder: "用户名...", name: "user", value: user, onChange: e => this.inputChange(e), onFocus: e => this.inputFocus(e) }),
                    React.createElement(Input, { type: "password", placeholder: "密码...", name: "pwd", value: pwd, onChange: e => this.inputChange(e), onFocus: e => this.inputFocus(e) }),
                    React.createElement(Input, { type: "password", placeholder: "重复密码...", name: "rePwd", value: rePwd, onChange: e => this.inputChange(e), onFocus: e => this.inputFocus(e) }),
                    React.createElement("span", { className: this.errorClass(pwdError) }, "\u5BC6\u7801\u9519\u8BEF\uFF01"),
                    React.createElement("span", { className: this.errorClass(regError !== undefined) }, regError),
                    React.createElement(Button, { onClick: () => this.submit(), disabled: disabled, block: true, color: "success" }, "\u6CE8\u518C\u65B0\u7528\u6237")))));
    }
    errorClass(error) {
        if (error === false) {
            return 'hidden-xs-up';
        }
    }
}
/*
            
            <div className="row">
                <div className="col-sm-6 col-sm-offset-3 form-box">
                    <div className="form-bottom">
                        <form role="form" action="" method="post" className="login-form">
                            <div className="form-group">
                                <label className="sr-only" htmlFor="form-username"
                                    style={{color: "black"}}>Username</label>
                                <input type="text" name="user"
                                    ref={input => this.userInput=input}
                                    placeholder="用户名..."
                                    className="form-username form-control"
                                    id="form-username"
                                    onChange={e => this.inputChange(e)}
                                    value={this.state.user} />
                            </div>
                            <div className="form-group">
                                <label className="sr-only" htmlFor="form-password">密码</label>
                                <input type="password" name="pwd"
                                    placeholder="密码..."
                                    className="form-password form-control" id="form-password"
                                    onChange={e => this.inputChange(e)}
                                    value={this.state.pwd} />
                            </div>
                            <div className="form-group">
                                <label className="sr-only" htmlFor="form-password">密码</label>
                                <input type="password" name="rePwd"
                                    placeholder="重复密码..."
                                    className="form-password form-control" id="form-password"
                                    onChange={e => this.inputChange(e)}
                                    value={this.state.rePwd} />
                            </div>
                            <button type="button"
                                className="btn btn-success"
                                onClick={() => this.submit()}>注册新账户</button>
                        </form>
                    </div>
                </div>
            </div>
            <div className="row">
                <div className="col-sm-6 col-sm-offset-3">
                    <button type="button" className="btn btn-link center-block"
                        onClick={() => {nav.replace(<LoginView />); }}>已有账户，直接登录</button>
                </div>
            </div>
*/ 
//# sourceMappingURL=register.js.map