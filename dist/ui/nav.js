var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as React from 'react';
import { observable } from 'mobx';
import { netToken } from '../net/netToken';
import FetchErrorView from './fetchErrorView';
import { appUrl, setMeInFrame } from '../net/appBridge';
import { LocalData } from '../local';
import { logoutApis, setCenterToken } from '../net';
import 'font-awesome/css/font-awesome.min.css';
import '../css/va.css';
const logo = require('../img/logo.svg');
;
export class NavView extends React.Component {
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
    componentWillMount() {
        return __awaiter(this, void 0, void 0, function* () {
            // 监听android手机的实体back键
            if (window.history && window.history.pushState) {
                window.addEventListener('popstate', function () {
                    var hashLocation = location.hash;
                    var hashSplit = hashLocation.split("#!/");
                    var hashName = hashSplit[1];
                    if (hashName !== '') {
                        var hash = window.location.hash;
                        if (hash === '') {
                            //alert("你点击了返回键");  
                            nav.back(true);
                        }
                    }
                });
                //window.history.pushState('forward', null, './#forward');  
            }
        });
    }
    componentDidMount() {
        return __awaiter(this, void 0, void 0, function* () {
            //nav.set(this.props.logo, this);
            nav.set(this);
            let hash = document.location.hash;
            console.log("url=%s hash=%s", document.location.origin, hash);
            if (hash !== undefined && hash !== '' && hash.startsWith('#tv')) {
                let mif = setMeInFrame(hash);
                nav.user = { id: 0 };
                if (self !== window.parent) {
                    window.parent.postMessage({ type: 'hide-frame-back', hash: mif.hash }, '*');
                }
                this.showAppView();
                return;
            }
            let user = nav.local.user.get();
            if (user !== undefined) {
                yield nav.logined(user);
            }
            else {
                yield nav.showLogin();
            }
        });
    }
    get level() {
        return this.stack.length;
    }
    showAppView() {
        let view = this.props.view;
        if (typeof view === 'function')
            this.show(view());
        else
            this.show(view);
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
        return __awaiter(this, void 0, void 0, function* () {
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
                yield nav.showLogin();
                return;
            }
            this.setState({
                fetchError: fetchError,
            });
            // setTimeout(() => this.setState({error: false}), 3000);
        });
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
        if (len === 0)
            return;
        if (len === 1 && self != window.top) {
            window.top.postMessage({ type: 'pop-app' }, '*');
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
        console.log('pages: %s', stack.length);
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
            elError = React.createElement(FetchErrorView, Object.assign({ clearError: () => this.setState({ fetchError: undefined }) }, fetchError));
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
export class Nav {
    constructor() {
        this.local = new LocalData();
        this.user = undefined; // = {id:undefined, name:undefined, token:undefined};
    }
    set(nav) {
        //this.logo = logo;
        this.nav = nav;
    }
    logined(user) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("logined: %s", JSON.stringify(user));
            this.local.user.set(user);
            netToken.set(user.token);
            this.user = user;
            this.nav.showAppView();
        });
    }
    showLogin() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.loginView === undefined) {
                let lv = yield import('../entry/login');
                //this.loginView = <lv.default logo={logo} />;
                this.loginView = React.createElement(lv.default, null);
            }
            this.nav.show(this.loginView);
        });
    }
    logout() {
        return __awaiter(this, void 0, void 0, function* () {
            this.local.logoutClear();
            this.user = undefined; //{} as User;
            logoutApis();
            setCenterToken(undefined);
            yield this.showLogin();
        });
    }
    get level() {
        return this.nav.level;
    }
    startWait() {
        this.nav.startWait();
    }
    endWait() {
        this.nav.endWait();
    }
    onError(error) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.nav.onError(error);
        });
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
    navToApp(url, unitId) {
        let uh = appUrl(url, unitId);
        console.log('navToApp: %s', JSON.stringify(uh));
        nav.push(React.createElement("article", { className: 'app-container' },
            React.createElement("span", { id: uh.hash, onClick: () => this.back() },
                React.createElement("i", { className: "fa fa-arrow-left" })),
            React.createElement("iframe", { src: uh.url })));
    }
    /*
    async getAppApi(apiName: string): Promise<{url:string, token:string}> {
        return await appApi(apiName);
    }*/
    navToSite(url) {
        // show in new window
        window.open(url);
    }
}
__decorate([
    observable
], Nav.prototype, "user", void 0);
export const nav = new Nav();
//# sourceMappingURL=nav.js.map