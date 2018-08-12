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
import { Page } from './page';
import { netToken } from '../net/netToken';
import FetchErrorView from './fetchErrorView';
import { appUrl, setMeInFrame } from '../net/appBridge';
import { LocalData } from '../local';
import { logoutApis, setCenterUrl, setCenterToken, WSChannel, getCenterUrl } from '../net';
import 'font-awesome/css/font-awesome.min.css';
import '../css/va.css';
import '../css/animation.css';
import { wsBridge } from '../net/wsChannel';
import { uid } from '../uid';
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
let stackKey = 1;
//let ws:WSChannel;
export class NavView extends React.Component {
    constructor(props) {
        super(props);
        this.waitCount = 0;
        this.isHistoryBack = false;
        this.clearError = () => {
            this.setState({ fetchError: undefined });
        };
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
            let start = this.props.start;
            if (start !== undefined) {
                yield start();
            }
            else {
                yield nav.start();
            }
        });
    }
    get level() {
        return this.stack.length;
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
        setTimeout(() => {
            /*
            this.setState({
                fetchError: undefined,
            });*/
            --this.waitCount;
            if (this.waitCount === 0) {
                if (this.waitTimeHandler !== undefined) {
                    clearTimeout(this.waitTimeHandler);
                    this.waitTimeHandler = undefined;
                }
                this.setState({ wait: 0 });
            }
        }, 100);
    }
    onError(fetchError) {
        return __awaiter(this, void 0, void 0, function* () {
            let err = fetchError.error;
            if (err !== undefined && err.unauthorized === true) {
                yield nav.showLogin();
                return;
            }
            this.setState({
                fetchError: fetchError,
            });
        });
    }
    show(view, disposer) {
        this.clear();
        this.push(view, disposer);
    }
    push(view, disposer) {
        if (this.stack.length > 0) {
            window.history.pushState('forward', null, null);
        }
        this.stack.push({ key: stackKey++, view: view, disposer: disposer });
        this.refresh();
        //console.log('push: %s pages', this.stack.length);
    }
    replace(view, disposer) {
        let item = undefined;
        let stack = this.stack;
        if (stack.length > 0) {
            item = stack.pop();
            //this.popAndDispose();
        }
        this.stack.push({ key: stackKey++, view: view, disposer: disposer });
        if (item !== undefined)
            this.dispose(item.disposer);
        this.refresh();
        //console.log('replace: %s pages', this.stack.length);
    }
    pop(level = 1) {
        let stack = this.stack;
        let len = stack.length;
        //console.log('pop start: %s pages level=%s', len, level);
        if (level <= 0 || len <= 1)
            return;
        if (len < level)
            level = len;
        let backLevel = 0;
        for (let i = 0; i < level; i++) {
            if (stack.length === 0)
                break;
            //stack.pop();
            this.popAndDispose();
            ++backLevel;
        }
        if (backLevel >= len)
            backLevel--;
        this.refresh();
        if (this.isHistoryBack !== true) {
            //window.removeEventListener('popstate', this.navBack);
            //window.history.back(backLevel);
            //window.addEventListener('popstate', this.navBack);
        }
        //console.log('pop: %s pages', stack.length);
    }
    popAndDispose() {
        let item = this.stack.pop();
        if (item === undefined)
            return;
        let { disposer } = item;
        this.dispose(disposer);
    }
    dispose(disposer) {
        if (disposer === undefined)
            return;
        let item = this.stack.find(v => v.disposer === disposer);
        if (item === undefined)
            disposer();
    }
    clear() {
        let len = this.stack.length;
        for (let i = 0; i < len; i++)
            this.popAndDispose();
        this.refresh();
        if (len > 1) {
            //window.removeEventListener('popstate', this.navBack);
            //window.history.back(len-1);
            //window.addEventListener('popstate', this.navBack);
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
    navBack() {
        nav.log('backbutton pressed - nav level: ' + this.stack.length);
        this.isHistoryBack = true;
        this.back(true);
        this.isHistoryBack = false;
    }
    back(confirm = true) {
        return __awaiter(this, void 0, void 0, function* () {
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
                if ((yield top.confirmClose()) === true)
                    this.pop();
            }
            else {
                this.pop();
            }
        });
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
            elError = React.createElement(FetchErrorView, Object.assign({ clearError: this.clearError }, fetchError));
        return (React.createElement("ul", { className: 'va' },
            stack.map((item, index) => {
                let { key, view } = item;
                return React.createElement("li", { key: key, style: index < top ? { visibility: 'hidden' } : undefined }, view);
            }),
            elWait,
            elError));
    }
    refresh() {
        // this.setState({flag: !this.state.flag});
        this.setState({ stack: this.stack });
        // this.forceUpdate();
    }
}
function loadCenterUrl() {
    return __awaiter(this, void 0, void 0, function* () {
        let centerUrl, wsHost;
        let hash = document.location.hash;
        if (hash.includes('sheet_debug') === true) {
            centerUrl = process.env.REACT_APP_CENTER_URL_DEBUG;
            wsHost = process.env.REACT_APP_WSHOST_DEBUG;
        }
        else if (process.env.NODE_ENV === 'development') {
            centerUrl = process.env.REACT_APP_CENTER_URL_DEBUG;
            if (centerUrl !== undefined) {
                wsHost = process.env.REACT_APP_WSHOST_DEBUG;
                try {
                    console.log('try connect debug url');
                    let ret = yield fetch(centerUrl);
                    console.log('connected');
                }
                catch (err) {
                    console.error(err);
                    centerUrl = undefined;
                }
            }
        }
        if (centerUrl === undefined) {
            centerUrl = process.env.REACT_APP_CENTER_URL;
            wsHost = process.env.REACT_APP_WSHOST;
        }
        return {
            centerUrl: centerUrl,
            wsHost: wsHost,
        };
    });
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
    registerReceiveHandler(handler) {
        if (this.ws === undefined)
            return;
        return this.ws.onWsReceiveAny(handler);
    }
    unregisterReceiveHandler(handlerId) {
        if (this.ws === undefined)
            return;
        if (handlerId === undefined)
            return;
        this.ws.endWsReceive(handlerId);
    }
    start() {
        return __awaiter(this, void 0, void 0, function* () {
            nav.push(React.createElement(Page, { header: false },
                React.createElement("div", { style: { height: '100%' }, className: "d-flex flex-fill align-items-center justify-content-center" },
                    React.createElement("div", { className: "d-flex align-items-center justify-content-center slide text-info", style: { width: '5em', height: '2em' } }, "\u52A0\u8F7D\u4E2D..."))));
            let { centerUrl, wsHost } = yield loadCenterUrl();
            setCenterUrl(centerUrl);
            this.wsHost = wsHost;
            let hash = document.location.hash;
            // document.title = document.location.origin;
            console.log("url=%s hash=%s", document.location.origin, hash);
            this.isInFrame = hash !== undefined && hash !== '' && hash.startsWith('#tv');
            if (this.isInFrame === true) {
                let mif = setMeInFrame(hash);
                if (mif !== undefined) {
                    this.ws = wsBridge;
                    console.log('this.ws = wsBridge in sub frame');
                    nav.user = { id: 0 };
                    if (self !== window.parent) {
                        window.parent.postMessage({ type: 'hide-frame-back', hash: mif.hash }, '*');
                    }
                    yield this.showAppView();
                    return;
                }
            }
            let device = this.local.device.get();
            let user = this.local.user.get();
            if (device === undefined) {
                device = uid();
                this.local.device.set(device);
                user = undefined;
            }
            if (user === undefined || user.device !== device) {
                yield nav.showLogin();
                return;
            }
            yield nav.logined(user);
        });
    }
    showAppView() {
        return __awaiter(this, void 0, void 0, function* () {
            let { onLogined } = this.nav.props;
            if (onLogined === undefined) {
                nav.push(React.createElement("div", null, "NavView has no prop onLogined"));
                return;
            }
            yield onLogined();
            console.log('logined: AppView shown');
        });
    }
    logined(user) {
        return __awaiter(this, void 0, void 0, function* () {
            let ws = this.ws = new WSChannel(this.wsHost, user.token);
            ws.onWsReceiveAny((msg) => __awaiter(this, void 0, void 0, function* () {
                console.log("websocket receive and post to frames: %s", JSON.stringify(msg));
                (window.opener || window.parent).postMessage({ type: 'ws', msg: msg }, '*');
            }));
            ws.connect();
            console.log("logined: %s", JSON.stringify(user));
            this.local.user.set(user);
            netToken.set(user.token);
            this.user = user;
            console.log('ws.connect() in app main frame');
            yield this.showAppView();
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
    show(view, disposer) {
        this.nav.show(view, disposer);
    }
    push(view, disposer) {
        this.nav.push(view, disposer);
    }
    replace(view, disposer) {
        this.nav.replace(view, disposer);
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
        return __awaiter(this, void 0, void 0, function* () {
            yield this.nav.back(confirm);
        });
    }
    regConfirmClose(confirmClose) {
        this.nav.regConfirmClose(confirmClose);
    }
    confirmBox(message) {
        return this.nav.confirmBox(message);
    }
    navToApp(url, unitId, apiId, sheetType, sheetId) {
        let centerUrl = getCenterUrl();
        let sheet = centerUrl.includes('http://localhost:') === true ? 'sheet_debug' : 'sheet';
        let uh = sheetId === undefined ?
            appUrl(url, unitId) :
            appUrl(url, unitId, sheet, [apiId, sheetType, sheetId]);
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