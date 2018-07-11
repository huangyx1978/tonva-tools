import * as React from 'react';
import {observable} from 'mobx';
import {User, decodeToken} from '../user';
import {Page} from './page';
import {netToken} from '../net/netToken';
import FetchErrorView from './fetchErrorView';
import {FetchError} from '../fetchError';
import {appUrl, appApi, setMeInFrame} from '../net/appBridge';
import {LocalData} from '../local';
import {logoutApis, setCenterToken, WSChannel} from '../net';
import 'font-awesome/css/font-awesome.min.css';
import '../css/va.css';

const regEx = new RegExp('Android|webOS|iPhone|iPad|' +
    'BlackBerry|Windows Phone|'  +
    'Opera Mini|IEMobile|Mobile' , 
    'i');
const isMobile = regEx.test(navigator.userAgent);
export const mobileHeaderStyle = isMobile? {
    minHeight:  '3em'
} : undefined;

const logo = require('../img/logo.svg');
const logs:string[] = [];

export interface Props //extends React.Props<Nav>
{
    view: JSX.Element | (()=>JSX.Element);
};
let stackKey = 1;
export interface StackItem {
    key: number;
    view: JSX.Element;
    confirmClose?: ()=>Promise<boolean>;
    disposer?: ()=>void;
}
export interface State {
    stack: StackItem[];
    wait: 0|1|2;
    fetchError: FetchError
}

const ws = new WSChannel(process.env.REACT_APP_WSHOST, undefined);

export class NavView extends React.Component<Props, State> {
    private stack: StackItem[];
    private htmlTitle: string;
    private waitCount: number = 0;
    private waitTimeHandler?: NodeJS.Timer;

    constructor(props) {
        super(props);
        this.back = this.back.bind(this);
        this.navBack = this.navBack.bind(this);
        this.stack = [];
        this.state = {
            stack: this.stack,
            wait: 0,
            fetchError: undefined
        };
    }
    async componentWillMount() {
        window.addEventListener('popstate', this.navBack);
    }

    private isInFrame:boolean;
    async componentDidMount()
    {
        //nav.set(this.props.logo, this);
        nav.set(this);

        let hash = document.location.hash;
        // document.title = document.location.origin;
        console.log("url=%s hash=%s", document.location.origin, hash);
        this.isInFrame = hash !== undefined && hash !== '' && hash.startsWith('#tv');
        if (this.isInFrame === true) {
            let mif = setMeInFrame(hash);
            if (mif !== undefined) {
                nav.user = {id:0} as User;
                if (self !== window.parent) {
                    window.parent.postMessage({type:'hide-frame-back', hash: mif.hash}, '*');
                }
                this.showAppView();
                return;
            }
        }
        let user: User = nav.local.user.get();
        if (user !== undefined) {
            await nav.logined(user);
        } else {
            await nav.showLogin();
        }
    }

    get level(): number {
        return this.stack.length;
    }

    showAppView() {
        let view = this.props.view;
        if (typeof view === 'function') this.show(view());
        else this.show(view);
        console.log('logined: AppView shown');
        if (this.isInFrame === true) {
            // 桥接主页的 websocket
            // ...
        }
        else {
            ws.connect();
        }
    }

    startWait() {
        if (this.waitCount === 0) {
            this.setState({wait: 1});
            this.waitTimeHandler = global.setTimeout(
                () => {
                    this.waitTimeHandler = undefined;
                    this.setState({wait: 2});
                },
                1000) as NodeJS.Timer;
        }
        ++this.waitCount;
        this.setState({
            fetchError: undefined,
        });
    }

    endWait() {
        setTimeout(() => {
            this.setState({
                fetchError: undefined,
            });
            --this.waitCount;
            if (this.waitCount === 0) {
                if (this.waitTimeHandler !== undefined) {
                    clearTimeout(this.waitTimeHandler);
                    this.waitTimeHandler = undefined;
                }
                this.setState({wait: 0});
            }
        },100);
    }

    async onError(fetchError: FetchError)
    {
        let err = fetchError.error;
        if (err !== undefined && err.unauthorized === true) {
            await nav.showLogin();
            return;
        }
        this.setState({
            fetchError: fetchError,
        });
    }

    show(view: JSX.Element, disposer?: ()=>void): void {
        this.clear();
        this.push(view, disposer);
    }

    push(view: JSX.Element, disposer?: ()=>void): void {
        if (this.stack.length > 0) {
            window.history.pushState('forward', null, null);
        }
        this.stack.push({key: stackKey++, view: view, disposer: disposer});
        this.refresh();
        //console.log('push: %s pages', this.stack.length);
    }

    replace(view: JSX.Element, disposer?: ()=>void): void {
        let item:StackItem = undefined;
        let stack = this.stack;
        if (stack.length > 0) {
            item = stack.pop();
            //this.popAndDispose();
        }
        this.stack.push({key: stackKey++, view: view, disposer: disposer});
        if (item !== undefined) this.dispose(item.disposer);
        this.refresh();
        //console.log('replace: %s pages', this.stack.length);
    }

    pop(level: Number = 1) {
        let stack = this.stack;
        let len = stack.length;
        //console.log('pop start: %s pages level=%s', len, level);
        if (level <= 0 || len <= 1) return;
        if (len < level) level = len;
        let backLevel = 0;
        for (let i = 0; i < level; i++) {
            if (stack.length === 0) break;
            //stack.pop();
            this.popAndDispose();
            ++backLevel;
        }
        if (backLevel >= len) backLevel--;
        this.refresh();
        if (this.isHistoryBack !== true) {
            //window.removeEventListener('popstate', this.navBack);
            //window.history.back(backLevel);
            //window.addEventListener('popstate', this.navBack);
        }
        //console.log('pop: %s pages', stack.length);
    }

    private popAndDispose() {
        let item = this.stack.pop();
        if (item === undefined) return;
        let {disposer} = item;
        this.dispose(disposer);
    }

    private dispose(disposer:()=>void) {
        if (disposer === undefined) return;
        let item = this.stack.find(v => v.disposer === disposer);
        if (item === undefined) disposer();
    }

    clear() {
        let len = this.stack.length;
        for (let i=0; i<len; i++) this.popAndDispose();
        this.refresh();
        if (len > 1) {
            //window.removeEventListener('popstate', this.navBack);
            //window.history.back(len-1);
            //window.addEventListener('popstate', this.navBack);
        }
    }

    regConfirmClose(confirmClose:()=>Promise<boolean>) {
        let stack = this.stack;
        let len = stack.length;
        if (len === 0) return;
        let top = stack[len-1];
        top.confirmClose = confirmClose;
    }

    private isHistoryBack:boolean = false;
    navBack() {
        nav.log('backbutton pressed - nav level: ' + this.stack.length);
        this.isHistoryBack = true;
        this.back(true);
        this.isHistoryBack = false;
    }

    async back(confirm:boolean = true) {
        let stack = this.stack;
        let len = stack.length;
        if (len === 0) return;
        if (len === 1) {
            if (self != window.top) {
                window.top.postMessage({type:'pop-app'}, '*');
            }
            return;
        }
        let top = stack[len-1];
        if (confirm===true && top.confirmClose) {
            if (await top.confirmClose()===true) this.pop();
        }
        else {
            this.pop();
        }
    }

    confirmBox(message?:string): boolean {
        return window.confirm(message);
    }
    render() {
        const {wait, fetchError} = this.state;
        let stack = this.state.stack;
        let top = stack.length - 1;
        let elWait = null, elError = null;
        switch (wait) {
            case 1:
                elWait = <li className="va-wait va-wait1">
                </li>;
                break;
            case 2:
                elWait = <li className="va-wait va-wait2">
                    <i className="fa fa-spinner fa-spin fa-3x fa-fw"></i>
                    <span className="sr-only">Loading...</span>
                </li>;
                break;
        }
        if (fetchError)
            elError = <FetchErrorView 
                clearError={()=>this.setState({fetchError: undefined})} 
                {...fetchError} />
        return (
        <ul className='va'>
            {
                stack.map((item, index) => {
                    let {key, view} = item;
                    return <li key={key} style={index<top? {visibility: 'hidden'}:undefined}>
                        {view}
                    </li>
                })
            }
            {elWait}
            {elError}
        </ul>
        );
    }

    private refresh() {
        // this.setState({flag: !this.state.flag});
        this.setState({stack: this.stack });
        // this.forceUpdate();
    }
}

export class Nav {
    private nav:NavView;
    //private logo: any;
    private loginView: JSX.Element;
    local: LocalData = new LocalData();
    @observable user: User = undefined; // = {id:undefined, name:undefined, token:undefined};
    
    set(nav:NavView) {
        //this.logo = logo;
        this.nav = nav;
    }

    debug() {        
    }

    registerReceiveHandler(handler: (message:any)=>Promise<void>):number {
        return ws.onWsReceiveAny(handler);
    }

    unregisterReceiveHandler(handlerId:number) {
        ws.endWsReceive(handlerId);
    }

    async logined(user: User) {
        console.log("logined: %s", JSON.stringify(user));
        this.local.user.set(user);
        netToken.set(user.token);
        this.user = user;
        this.nav.showAppView();
    }

    async showLogin() {
        if (this.loginView === undefined) {
            let lv = await import('../entry/login');
            //this.loginView = <lv.default logo={logo} />;
            this.loginView = <lv.default />;
        }
        this.nav.clear();
        this.pop();
        this.nav.show(this.loginView);
    }

    async logout() {
        this.local.logoutClear();
        this.user = undefined; //{} as User;
        logoutApis();
        setCenterToken(undefined);
        await this.showLogin();
    }
 
    get level(): number {
        return this.nav.level;
    }
    startWait() {
        this.nav.startWait();
    }
    endWait() {
        this.nav.endWait();
    }
    async onError(error: FetchError) {
        await this.nav.onError(error);
    }
    show (view: JSX.Element, disposer?: ()=>void): void {
        this.nav.show(view, disposer);
    }
    push(view: JSX.Element, disposer?: ()=>void): void {
        this.nav.push(view, disposer);
    }
    replace(view: JSX.Element, disposer?: ()=>void): void {
        this.nav.replace(view, disposer);
    }
    pop(level: Number = 1) {
        this.nav.pop(level);
    }
    clear() {
        this.nav.clear();
    }
    navBack() {
        this.nav.navBack();
    }
    async back(confirm:boolean = true) {
        await this.nav.back(confirm);
    }
    regConfirmClose(confirmClose: ()=>Promise<boolean>) {
        this.nav.regConfirmClose(confirmClose);
    }
    confirmBox(message?:string): boolean {
        return this.nav.confirmBox(message);
    }
    navToApp(url: string, unitId: number) {
        let uh = appUrl(url, unitId);
        console.log('navToApp: %s', JSON.stringify(uh));
        nav.push(<article className='app-container'>
            <span id={uh.hash} onClick={()=>this.back()} style={mobileHeaderStyle}>
                <i className="fa fa-arrow-left" />
            </span>
            <iframe src={uh.url} />
        </article>);
    }
    navToSite(url: string) {
        // show in new window
        window.open(url);
    }

    get logs() {return logs};
    log(msg:string) {
        logs.push(msg);
    } 
}
export const nav: Nav = new Nav();
