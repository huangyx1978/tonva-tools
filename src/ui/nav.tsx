import * as React from 'react';
import {observable} from 'mobx';
import {User, decodeToken} from '../user';
import {Page} from './page';
import {netToken} from '../net/netToken';
import FetchErrorView from './fetchErrorView';
import {FetchError} from '../fetchError';
import {appUrl, appApi, setMeInFrame} from '../net/appBridge';
import {LocalData} from '../local';
import {logoutApis, setCenterToken} from '../net';
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
export interface StackItem {
    view: JSX.Element;
    confirmClose?: ()=>boolean;
}
export interface State {
    stack: StackItem[];
    wait: 0|1|2;
    fetchError: FetchError
}

export class NavView extends React.Component<Props, State> {
    //events = new EventEmitter();

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

    async componentDidMount()
    {
        //nav.set(this.props.logo, this);
        nav.set(this);

        let hash = document.location.hash;
        // document.title = document.location.origin;
        console.log("url=%s hash=%s", document.location.origin, hash);
        if (hash !== undefined && hash !== '' && hash.startsWith('#tv')) {
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

    get level(): Number {
        return this.stack.length;
    }

    showAppView() {
        let view = this.props.view;
        if (typeof view === 'function') this.show(view());
        else this.show(view);
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
    }

    async onError(fetchError: FetchError)
    {
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
            await nav.showLogin();
            return;
        }
        this.setState({
            fetchError: fetchError,
        });
        // setTimeout(() => this.setState({error: false}), 3000);
    }

    show(view: JSX.Element): void {
        this.clear();
        this.push(view);
    }

    push(view: JSX.Element): void {
        if (this.stack.length > 0) {
            window.history.pushState('forward', null, null);
        }
        this.stack.push({view: view});
        this.refresh();
    }

    replace(view: JSX.Element): void {
        let stack = this.stack;
        if (stack.length > 0) {
            stack.pop();
        }
        this.stack.push({view: view});
        this.refresh();
    }

    pop(level: Number = 1) {
        if (level <= 0) return;
        let stack = this.stack;
        let len = stack.length;
        if (len <= 1) return;
        if (len < level) level = len;

        let backLevel = 0;
        for (let i = 0; i < level; i++) {
            if (stack.length === 0) { break; }
            stack.pop();
            ++backLevel;
        }
        if (backLevel >= len) backLevel--;
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
            window.history.back(len-1);
            window.removeEventListener('popstate', this.navBack);
        }
    }

    regConfirmClose(confirmClose:()=>boolean) {
        let stack = this.stack;
        let len = stack.length;
        if (len === 0) return;
        let top = stack[len-1];
        top.confirmClose = confirmClose;
    }

    private isHistoryBack:boolean = false;
    //private stopPopstateEvent:boolean = false;
    navBack() {
        //if (this.stopPopstateEvent === true) return;
        nav.log('backbutton pressed - nav level: ' + this.stack.length);
        this.isHistoryBack = true;
        this.back(true);
        this.isHistoryBack = false;
    }

    back(confirm:boolean = true) {
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
            if (top.confirmClose()===true) this.pop();
        }
        else {
            this.pop();
        }
        console.log('pages: %s', stack.length);
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
                stack.map((view, index) =>
                    <li key={index} style={index<top? {visibility: 'hidden'}:undefined}>
                        {view.view}
                    </li>)
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
 
    get level() {
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
    show (view: JSX.Element): void {
        this.nav.show(view);
    }
    push(view: JSX.Element): void {
        this.nav.push(view);
    }
    replace(view: JSX.Element): void {
        this.nav.replace(view);
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
    back(confirm:boolean = true) {
        this.nav.back(confirm);
    }
    regConfirmClose(confirmClose: ()=>boolean) {
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
