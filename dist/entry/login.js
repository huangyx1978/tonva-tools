"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const reactstrap_1 = require("reactstrap");
const classNames = require("classnames");
const ui_1 = require("../ui");
const register_1 = require("./register");
const forget_1 = require("./forget");
const userApi_1 = require("./userApi");
require("../css/va-form.css");
const logo = require('../img/logo.svg');
class Login extends React.Component {
    constructor(props) {
        super(props);
        this.values = {
            username: '',
            password: '',
        };
        this.state = {
            values: this.values,
            hasError: false,
            disabled: true,
        };
        this.onSubmit = this.onSubmit.bind(this);
    }
    click() {
        ui_1.nav.replace(React.createElement(register_1.default, null));
    }
    inputChange(event) {
        const target = event.target;
        const inputValue = target.type === 'checkbox' ? target.checked : target.value;
        const inputName = target.name;
        this.values[inputName] = inputValue;
        let { username, password } = this.values;
        let disabled = username.trim().length === 0 || password.length === 0;
        this.setState({
            values: this.values,
            disabled: disabled,
        });
    }
    inputFocus(event) {
        this.setState({ hasError: false });
        if (this.timeOut !== undefined) {
            clearTimeout(this.timeOut);
            this.timeOut = undefined;
        }
    }
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
    onSubmit(e) {
        return __awaiter(this, void 0, void 0, function* () {
            e.preventDefault();
            let { username, password } = this.values;
            let user = yield userApi_1.default.login({
                user: username,
                pwd: password
            });
            if (user === undefined) {
                this.failed();
            }
            else {
                ui_1.nav.logined(user);
                // this.succeed(user);
            }
        });
    }
    failed() {
        this.values.username = '';
        this.values.password = '';
        this.setState({
            values: this.values,
            hasError: true,
            disabled: true,
        });
        this.timeOut = global.setTimeout(() => {
            this.setState({ hasError: false });
            global.clearTimeout(this.timeOut);
            this.timeOut = undefined;
        }, 3000);
    }
    render() {
        let { hasError, values, disabled } = this.state;
        let { username, password } = values;
        let footer = React.createElement("div", { className: 'text-center' },
            React.createElement(reactstrap_1.Button, { color: "link", style: { margin: '0px auto' }, onClick: () => ui_1.nav.push(React.createElement(register_1.default, null)) }, "\u5982\u679C\u6CA1\u6709\u8D26\u53F7\uFF0C\u8BF7\u6CE8\u518C"));
        return (React.createElement(ui_1.Page, { header: false, footer: footer },
            React.createElement(reactstrap_1.Container, { className: 'entry-form' },
                React.createElement(reactstrap_1.Form, { onSubmit: this.onSubmit },
                    React.createElement("header", null,
                        React.createElement("img", { className: 'App-logo', src: logo }),
                        React.createElement("span", null, "\u540C\u82B1")),
                    React.createElement(reactstrap_1.Input, { type: 'text', placeholder: "用户名...", name: 'username', value: username, onChange: e => this.inputChange(e), onFocus: e => this.inputFocus(e) }),
                    React.createElement(reactstrap_1.Input, { type: 'password', placeholder: "密码...", name: 'password', value: password, onChange: e => this.inputChange(e), onFocus: e => this.inputFocus(e) }),
                    React.createElement("span", { className: classNames(hasError === false ? 'hidden-xs-up' : undefined) }, "\u7528\u6237\u540D\u6216\u5BC6\u7801\u9519\uFF01"),
                    React.createElement(reactstrap_1.Button, { type: 'submit', disabled: disabled, block: true, color: 'success' }, "\u767B\u5F55"),
                    React.createElement("div", { style: { display: 'flex', alignItems: 'center' } },
                        React.createElement(reactstrap_1.Button, { color: "link", block: true, onClick: () => ui_1.nav.push(React.createElement(forget_1.default, null)) }, "\u5FD8\u8BB0\u5BC6\u7801"))))));
    }
}
exports.default = Login;
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