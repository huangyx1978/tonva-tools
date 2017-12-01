import * as React from 'react';
import {observable} from 'mobx';
import {User} from './user';
import {Page} from './page';
import {netToken} from '../net';
import FetchErrorView from './fetchErrorView';
import {FetchError} from '../fetchError';
import 'font-awesome/css/font-awesome.min.css';
import '../css/va.css';

export interface Props //extends React.Props<Nav>
{
    //showLogin: () => void;
    //login: JSX.Element;
    //view: JSX.Element | ((path:string)=>JSX.Element);
    // token?: string;
    //dispatch?: Dispatch<{}>;
};
export interface StackItem {
    view: JSX.Element;
    confirmClose?: ()=>boolean;
}
export interface State {
    stack: StackItem[];
    wait: boolean;
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
        this.htmlTitle = document.title;
        this.stack = [];
        this.state = {
            stack: this.stack,
            wait: false,
            fetchError: undefined
        };
    }

    componentDidMount()
    {
        nav.set(this);
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

    get level(): Number {
        return this.stack.length;
    }

    startWait() {
        if (this.waitCount === 0) {
            this.waitTimeHandler = global.setTimeout(
                () => {
                    this.waitTimeHandler = undefined;
                    this.setState({wait: true});
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
            this.setState({wait: false});
        }
    }

    onError(fetchError: FetchError)
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
            nav.showLogin();
            return;
        }
        this.setState({
            fetchError: fetchError,
        });
        // setTimeout(() => this.setState({error: false}), 3000);
    }

    show (view: JSX.Element): void {
        this.clear();
        this.push(view);
    }

    push(view: JSX.Element): void {
        this.renderAndPush(view);
        this.refresh();
        //this.events.emit('changed');
    }

    replace(view: JSX.Element): void {
        let stack = this.stack;
        if (stack.length > 0) {
            stack.pop();
        }
        this.renderAndPush(view);
        this.refresh();
        //this.events.emit('changed');
    }

    pop(level: Number = 1) {
        let stack = this.stack;
        let changed = false;
        for (let i = 0; i < level; i++) {
            if (stack.length === 0) { break; }
            stack.pop();
            this.refresh();
            changed = true;
        }
        //if (changed) { this.events.emit('changed'); }
    }

    clear() {
        if (this.stack.length === 0) { return; }
        this.stack.splice(0, this.stack.length);
        this.refresh();
        //this.events.emit('changed');
    }

    regConfirmClose(confirmClose:()=>boolean) {
        let stack = this.stack;
        let len = stack.length;
        if (len === 0) return;
        let top = stack[len-1];
        top.confirmClose = confirmClose;
    }

    back(confirm:boolean = true) {
        let stack = this.stack;
        let len = stack.length;
        console.log('pages: %s', len);
        if (len === 0) return;
        if (len === 1 && self!=window.top) {
            window.top.postMessage({cmd:'popPage'}, '*');
            return;
        }
        let top = stack[len-1];
        if (confirm===true && top.confirmClose) {
            if (top.confirmClose()===true) this.pop();
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
        if (wait === true) {
            // <Spinner name="circle" color="blue" />
            elWait = <li className='va-wait'>
                <i className="fa fa-spinner fa-spin fa-3x fa-fw"></i>
                <span className="sr-only">Loading...</span>
            </li>;
        }
        if (fetchError)
            elError = <FetchErrorView 
                clearError={()=>this.setState({fetchError: undefined})} 
                {...fetchError} />
        return (
        <ul className='va'>
            {
                stack.map((view, index) => {
                    let p:any = {
                        key: index,
                    };
                    if (index !== top) p.style = {visibility: 'hidden'};
                    return <li {...p}>{view.view}</li>;
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

    private renderAndPush(view: JSX.Element) {
        this.stack.push({view: view});
    }
}

export class Nav {
    private nav:NavView;
    private loginView: JSX.Element;
    private appView: JSX.Element;
    local: LocalData = new LocalData();
    @observable user: User = {} as User;
    
    setViews(loginView: JSX.Element, appView: JSX.Element) {
        this.loginView = loginView;
        this.appView = appView;
    }

    set(nav:NavView) {
        this.nav = nav;
    }

    logined(user: User) {
        Object.assign(this.user, user);
        this.local.user.set(user);
        netToken.set(user.token);
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
    onError(error: FetchError) {
        this.nav.onError(error);
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
    back(confirm:boolean = true) {
        this.nav.back(confirm);
    }
    regConfirmClose(confirmClose: ()=>boolean) {
        this.nav.regConfirmClose(confirmClose);
    }
    confirmBox(message?:string): boolean {
        return this.nav.confirmBox(message);
    }
    navToApp(url: string) {
        this.showApp(url);
    }

    private showApp(url: string) {
        //let index = this.find(hao, applet);
        //if (index < 0) {
        //    alert('在弹出app窗口时发生错误！');
        //    return;
        //}
        //let appWin = this.appWins[index];
        //let url = appUrl + '#' + token;
        //if (!url.toLowerCase().startsWith('http://')) url = 'http://' + url;
        nav.push(<article className='app-container'>
            <span onClick={()=>this.back()}>
                <i className="fa fa-arrow-left" />
            </span>
            <iframe src={url} />
        </article>);
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

export interface ClearableData {
    clear(): void;
}

export class Data<T> implements ClearableData {
    private name: string;
    private value?: T;
    constructor(name: string) {this.name = name; }
    get(): T {
        if (this.value !== undefined) return this.value;
        let v = localStorage.getItem(this.name);
        return this.value = v === null ? undefined : JSON.parse(v); 
    }
    set(value: T) {
        if (!value) { this.clear(); return; }
        this.value = value;
        localStorage.setItem(this.name, JSON.stringify(value));
    }
    clear() {
        this.value = undefined;
        localStorage.removeItem(this.name);
    }
}

export class LocalData {
    user = new Data<User>('user');
    homeTabCur = new Data<number>('homeTabCur');

    logoutClear() {
        [
            this.user, 
            this.homeTabCur
        ].map(d => d.clear());
    }
}

export const nav: Nav = new Nav();
