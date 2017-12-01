"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const mobx_1 = require("mobx");
const net_1 = require("../net");
const fetchErrorView_1 = require("./fetchErrorView");
require("font-awesome/css/font-awesome.min.css");
require("../css/va.css");
;
class NavView extends React.Component {
    constructor(props) {
        super(props);
        this.waitCount = 0;
        this.back = this.back.bind(this);
        this.htmlTitle = document.title;
        this.stack = [];
        this.state = {
            stack: this.stack,
            wait: false,
            fetchError: undefined
        };
    }
    componentDidMount() {
        exports.nav.set(this);
        /*
        let view:JSX.Element;
        let v = this.props.view;

        let path = window.location.pathname;
        if (path === undefined) {
            path = '';
        }
        else {
            if (path.substr(0, 1) === '/')
                path = path.substr(1).toLowerCase();
        }
        let token = window.location.hash;
        if (token) {
            token = token.substr(1);
        }

        if (typeof v === 'function') {
            view = v(path);
        }
        else {
            view = v;
        }*/
        /*
        start(
            this.props.dispatch,
            this.props.serverUrl,
            this.props.login,
            view,
            token);
        */
    }
    get level() {
        return this.stack.length;
    }
    startWait() {
        if (this.waitCount === 0) {
            this.waitTimeHandler = global.setTimeout(() => {
                this.waitTimeHandler = undefined;
                this.setState({ wait: true });
            }, 1000);
        }
        ++this.waitCount;
        this.setState({
            fetchError: undefined,
        });
    }
    endWait() {
        this.setState({
            fetchError: undefined,
        });
        --this.waitCount;
        if (this.waitCount === 0) {
            if (this.waitTimeHandler !== undefined) {
                clearTimeout(this.waitTimeHandler);
                this.waitTimeHandler = undefined;
            }
            this.setState({ wait: false });
        }
    }
    onError(fetchError) {
        let err = fetchError.error;
        if (err !== undefined && err.unauthorized === true) {
            /*
            let loginView = this.props.login;
            if (loginView === undefined) {
                alert('Not authorized, server refused!');
            }
            else {
                this.show(loginView);
            }*/
            //this.props.showLogin();
            exports.nav.showLogin();
            return;
        }
        this.setState({
            fetchError: fetchError,
        });
        // setTimeout(() => this.setState({error: false}), 3000);
    }
    show(view) {
        this.clear();
        this.push(view);
    }
    push(view) {
        this.renderAndPush(view);
        this.refresh();
        //this.events.emit('changed');
    }
    replace(view) {
        let stack = this.stack;
        if (stack.length > 0) {
            stack.pop();
        }
        this.renderAndPush(view);
        this.refresh();
        //this.events.emit('changed');
    }
    pop(level = 1) {
        let stack = this.stack;
        let changed = false;
        for (let i = 0; i < level; i++) {
            if (stack.length === 0) {
                break;
            }
            stack.pop();
            this.refresh();
            changed = true;
        }
        //if (changed) { this.events.emit('changed'); }
    }
    clear() {
        if (this.stack.length === 0) {
            return;
        }
        this.stack.splice(0, this.stack.length);
        this.refresh();
        //this.events.emit('changed');
    }
    regConfirmClose(confirmClose) {
        let stack = this.stack;
        let len = stack.length;
        if (len === 0)
            return;
        let top = stack[len - 1];
        top.confirmClose = confirmClose;
    }
    back(confirm = true) {
        let stack = this.stack;
        let len = stack.length;
        console.log('pages: %s', len);
        if (len === 0)
            return;
        if (len === 1 && self != window.top) {
            window.top.postMessage({ cmd: 'popPage' }, '*');
            return;
        }
        let top = stack[len - 1];
        if (confirm === true && top.confirmClose) {
            if (top.confirmClose() === true)
                this.pop();
        }
        else {
            this.pop();
        }
    }
    confirmBox(message) {
        return window.confirm(message);
    }
    render() {
        const { wait, fetchError } = this.state;
        let stack = this.state.stack;
        let top = stack.length - 1;
        let elWait = null, elError = null;
        if (wait === true) {
            // <Spinner name="circle" color="blue" />
            elWait = React.createElement("li", { className: 'va-wait' },
                React.createElement("i", { className: "fa fa-spinner fa-spin fa-3x fa-fw" }),
                React.createElement("span", { className: "sr-only" }, "Loading..."));
        }
        if (fetchError)
            elError = React.createElement(fetchErrorView_1.default, Object.assign({ clearError: () => this.setState({ fetchError: undefined }) }, fetchError));
        return (React.createElement("ul", { className: 'va' },
            stack.map((view, index) => {
                let p = {
                    key: index,
                };
                if (index !== top)
                    p.style = { visibility: 'hidden' };
                return React.createElement("li", Object.assign({}, p), view.view);
            }),
            elWait,
            elError));
    }
    refresh() {
        // this.setState({flag: !this.state.flag});
        this.setState({ stack: this.stack });
        // this.forceUpdate();
    }
    renderAndPush(view) {
        this.stack.push({ view: view });
    }
}
exports.NavView = NavView;
class Nav {
    constructor() {
        this.local = new LocalData();
        this.user = {};
    }
    setViews(loginView, appView) {
        this.loginView = loginView;
        this.appView = appView;
    }
    set(nav) {
        this.nav = nav;
    }
    logined(user) {
        Object.assign(this.user, user);
        this.local.user.set(user);
        net_1.netToken.set(user.token);
        this.nav.show(this.appView);
    }
    showLogin() {
        this.nav.show(this.loginView);
    }
    logout() {
        this.local.logoutClear();
        this.showLogin();
    }
    get level() {
        return this.nav.level;
    }
    //get events() {
    //    return this.nav.events;
    //}
    startWait() {
        this.nav.startWait();
    }
    endWait() {
        this.nav.endWait();
    }
    onError(error) {
        this.nav.onError(error);
    }
    show(view) {
        this.nav.show(view);
    }
    push(view) {
        this.nav.push(view);
    }
    replace(view) {
        this.nav.replace(view);
    }
    pop(level = 1) {
        this.nav.pop(level);
    }
    clear() {
        this.nav.clear();
    }
    back(confirm = true) {
        this.nav.back(confirm);
    }
    regConfirmClose(confirmClose) {
        this.nav.regConfirmClose(confirmClose);
    }
    confirmBox(message) {
        return this.nav.confirmBox(message);
    }
    navToApp(url) {
        this.showApp(url);
    }
    showApp(url) {
        //let index = this.find(hao, applet);
        //if (index < 0) {
        //    alert('在弹出app窗口时发生错误！');
        //    return;
        //}
        //let appWin = this.appWins[index];
        //let url = appUrl + '#' + token;
        //if (!url.toLowerCase().startsWith('http://')) url = 'http://' + url;
        exports.nav.push(React.createElement("article", { className: 'app-container' },
            React.createElement("span", { onClick: () => this.back() },
                React.createElement("i", { className: "fa fa-arrow-left" })),
            React.createElement("iframe", { src: url })));
        /*
        appWin.win.location.href = url;
        let pos = url.indexOf('//');
        if (pos < 0) pos = 0;
        else pos += 2;
        pos = url.indexOf('/', pos);
        appWin.url = url.substring(0, pos<0? undefined : pos);
        setTimeout(() => {
            appWin.win.postMessage(undefined, appWin.url);
        }, 1000);
        */
    }
}
__decorate([
    mobx_1.observable
], Nav.prototype, "user", void 0);
exports.Nav = Nav;
class Data {
    constructor(name) { this.name = name; }
    get() {
        if (this.value !== undefined)
            return this.value;
        let v = localStorage.getItem(this.name);
        return this.value = v === null ? undefined : JSON.parse(v);
    }
    set(value) {
        if (!value) {
            this.clear();
            return;
        }
        this.value = value;
        localStorage.setItem(this.name, JSON.stringify(value));
    }
    clear() {
        this.value = undefined;
        localStorage.removeItem(this.name);
    }
}
exports.Data = Data;
class LocalData {
    constructor() {
        this.user = new Data('user');
        this.homeTabCur = new Data('homeTabCur');
    }
    logoutClear() {
        [
            this.user,
            this.homeTabCur
        ].map(d => d.clear());
    }
}
exports.LocalData = LocalData;
exports.nav = new Nav();
//# sourceMappingURL=nav.js.map