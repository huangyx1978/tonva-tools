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
const regEx = new RegExp('Android|webOS|iPhone|iPad|' +
    'BlackBerry|Windows Phone|' +
    'Opera Mini|IEMobile|Mobile', 'i');
const isMobile = regEx.test(navigator.userAgent);
export const mobileHeaderStyle = isMobile ? {
    minHeight: '3em'
} : undefined;
const logo = require('../img/logo.svg');
const logs = [];
;
export class NavView extends React.Component {
    constructor(props) {
        super(props);
        this.waitCount = 0;
        this.isHistoryBack = false;
        this.back = this.back.bind(this);
        this.navBack = this.navBack.bind(this);
        this.stack = [];
        this.state = {
            stack: this.stack,
            wait: 0,
            fetchError: undefined
        };
    }
    componentWillMount() {
        return __awaiter(this, void 0, void 0, function* () {
            window.addEventListener('popstate', this.navBack);
        });
    }
    componentDidMount() {
        return __awaiter(this, void 0, void 0, function* () {
            //nav.set(this.props.logo, this);
            nav.set(this);
            let hash = document.location.hash;
            // document.title = document.location.origin;
            console.log("url=%s hash=%s", document.location.origin, hash);
            if (hash !== undefined && hash !== '' && hash.startsWith('#tv')) {
                let mif = setMeInFrame(hash);
                if (mif !== undefined) {
                    nav.user = { id: 0 };
                    if (self !== window.parent) {
                        window.parent.postMessage({ type: 'hide-frame-back', hash: mif.hash }, '*');
                    }
                    this.showAppView();
                    return;
                }
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
            this.setState({ wait: 1 });
            this.waitTimeHandler = global.setTimeout(() => {
                this.waitTimeHandler = undefined;
                this.setState({ wait: 2 });
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
            this.setState({ wait: 0 });
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
        if (this.stack.length > 0) {
            window.history.pushState('forward', null, null);
        }
        this.stack.push({ view: view });
        this.refresh();
    }
    replace(view) {
        let stack = this.stack;
        if (stack.length > 0) {
            stack.pop();
        }
        this.stack.push({ view: view });
        this.refresh();
    }
    pop(level = 1) {
        if (level <= 0)
            return;
        let stack = this.stack;
        let len = stack.length;
        if (len <= 1)
            return;
        if (len < level)
            level = len;
        let backLevel = 0;
        for (let i = 0; i < level; i++) {
            if (stack.length === 0) {
                break;
            }
            stack.pop();
            ++backLevel;
        }
        if (backLevel >= len)
            backLevel--;
        this.refresh();
        if (this.isHistoryBack !== true) {
            window.removeEventListener('popstate', this.navBack);
            window.history.back(backLevel);
            window.removeEventListener('popstate', this.navBack);
        }
    }
    clear() {
        let len = this.stack.length;
        this.stack = [];
        //let len = this.stack.length;
        //if (len === 0) { return; }
        //for (let i=0; i<len; i++) this.pop();
        this.refresh();
        if (len > 1) {
            window.removeEventListener('popstate', this.navBack);
            window.history.back(len - 1);
            window.removeEventListener('popstate', this.navBack);
        }
    }
    regConfirmClose(confirmClose) {
        let stack = this.stack;
        let len = stack.length;
        if (len === 0)
            return;
        let top = stack[len - 1];
        top.confirmClose = confirmClose;
    }
    //private stopPopstateEvent:boolean = false;
    navBack() {
        //if (this.stopPopstateEvent === true) return;
        nav.log('backbutton pressed - nav level: ' + this.stack.length);
        this.isHistoryBack = true;
        this.back(true);
        this.isHistoryBack = false;
    }
    back(confirm = true) {
        let stack = this.stack;
        let len = stack.length;
        if (len === 0)
            return;
        if (len === 1) {
            if (self != window.top) {
                window.top.postMessage({ type: 'pop-app' }, '*');
            }
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
        switch (wait) {
            case 1:
                elWait = React.createElement("li", { className: "va-wait va-wait1" });
                break;
            case 2:
                elWait = React.createElement("li", { className: "va-wait va-wait2" },
                    React.createElement("i", { className: "fa fa-spinner fa-spin fa-3x fa-fw" }),
                    React.createElement("span", { className: "sr-only" }, "Loading..."));
                break;
        }
        if (fetchError)
            elError = React.createElement(FetchErrorView, Object.assign({ clearError: () => this.setState({ fetchError: undefined }) }, fetchError));
        return (React.createElement("ul", { className: 'va' },
            stack.map((view, index) => React.createElement("li", { key: index, style: index < top ? { visibility: 'hidden' } : undefined }, view.view)),
            elWait,
            elError));
    }
    refresh() {
        // this.setState({flag: !this.state.flag});
        this.setState({ stack: this.stack });
        // this.forceUpdate();
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
    debug() {
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
            this.nav.clear();
            this.pop();
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
    navBack() {
        this.nav.navBack();
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
            React.createElement("span", { id: uh.hash, onClick: () => this.back(), style: mobileHeaderStyle },
                React.createElement("i", { className: "fa fa-arrow-left" })),
            React.createElement("iframe", { src: uh.url })));
    }
    navToSite(url) {
        // show in new window
        window.open(url);
    }
    get logs() { return logs; }
    ;
    log(msg) {
        logs.push(msg);
    }
}
__decorate([
    observable
], Nav.prototype, "user", void 0);
export const nav = new Nav();
//# sourceMappingURL=nav.js.map