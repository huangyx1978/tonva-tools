import * as React from 'react';
import _ from 'lodash';
import {isDevelopment} from '../local';
import {User} from '../user';
import {nav} from './nav';
import {Page} from './page';

export abstract class Controller {
    readonly res: any;
    readonly x: any;
    icon: string|JSX.Element;
    label:string;
    readonly isDev:boolean = isDevelopment;
    get user():User {return nav.user}
    get isLogined():boolean {
        let {user} = nav;
        if (user === undefined) return false;
        return user.id > 0;
    }
    constructor(res:any) {
        this.res = res || {};
        this.x = this.res.x || {};
    }

    private receiveHandlerId:number;
    private disposer:()=>void;

    private dispose() {
        // message listener的清理
        nav.unregisterReceiveHandler(this.receiveHandlerId);
        this.onDispose();
    }

    protected onDispose() {
    }

    protected async showVPage(vp: new (coordinator: Controller)=>VPage<Controller>, param?:any):Promise<void> {
        await (new vp(this)).showEntry(param);
    }

    protected renderView(view: new (coordinator: Controller)=>View<Controller>, param?:any) {
        return (new view(this)).render(param);
    }

    async event(type:string, value:any) {
        await this.onEvent(type, value);
    }

    protected async onEvent(type:string, value:any) {
    }

    protected msg(text:string) {
        alert(text);
    }
    protected errorPage(header:string, err:any) {
        this.openPage(<Page header="App error!">
            <pre>
                {typeof err === 'string'? err : err.message}
            </pre>
        </Page>);
    }

    protected onMessage(message:any):Promise<void> {
        return;
    }

    private onMessageReceive = async (message:any):Promise<void> => {
        await this.onMessage(message);
    }
    protected async beforeStart():Promise<boolean> {
        /*
        console.log('this.receiveHandlerId = nav.registerReceiveHandler(this.onMessageReceive);');
        this.receiveHandlerId = nav.registerReceiveHandler(this.onMessageReceive);
        console.log('return true');
        */
        this.registerReceiveHandler();
        return true;
    }
    protected registerReceiveHandler() {
        this.receiveHandlerId = nav.registerReceiveHandler(this.onMessageReceive);
    }

    protected abstract internalStart(param?:any):Promise<void>;
    async start(param?:any):Promise<void> {
        this.disposer = this.dispose.bind(this);
        let ret = await this.beforeStart();
        if (ret === false) return;
        await this.internalStart(param);
    }

    get isCalling():boolean {return this._resolve_$ !== undefined}

    private _resolve_$:((value:any) => void)[];
    async call(param?:any):Promise<any> {
        if (this._resolve_$ === undefined) this._resolve_$ = [];
        return new Promise<any> (async (resolve, reject) => {
            this._resolve_$.push(resolve);
            await this.start(param);
        });
    }

    async vCall(vp: new (coordinator: Controller)=>VPage<Controller>, param?:any):Promise<any> {
        if (this._resolve_$ === undefined) this._resolve_$ = [];
        return new Promise<any> (async (resolve, reject) => {
            this._resolve_$.push(resolve);
            await (new vp(this)).showEntry(param);
        });
    }

    returnCall(value:any) {
        if (this._resolve_$ === undefined) return;
        let resolve = this._resolve_$.pop();
        if (resolve === undefined) {
            alert('the Coordinator call already returned, or not called');
            return;
        }
        resolve(value);
    }

    openPage(page:JSX.Element) {
        nav.push(page, this.disposer);
        this.disposer = undefined;
    }

    replacePage(page:JSX.Element) {
        nav.replace(page, this.disposer);
        this.disposer = undefined;
    }

    backPage() {
        nav.back();
    }

    closePage(level?:number) {
        nav.pop(level);
    }

    ceasePage(level?:number) {
        nav.ceaseTop(level);
    }

    removeCeased() {
        nav.removeCeased();
    }

    regConfirmClose(confirmClose: ()=>Promise<boolean>) {
        nav.regConfirmClose(confirmClose);
    }
}


export abstract class View<C extends Controller> {
    protected controller: C;
    protected readonly res: any;
    protected readonly x: any;

    constructor(controller: C) {
        this.controller = controller;
        this.res = controller.res;
        this.x = controller.x;
    }

    protected get isDev() {return isDevelopment}

    abstract render(param?:any): JSX.Element;

    protected renderVm(vm: new (coordinator: Controller)=>View<C>, param?:any) {
        return (new vm(this.controller)).render(param);
    }

    protected async showVPage(vp: new (coordinator: Controller)=>VPage<Controller>, param?:any):Promise<void> {
        await (new vp(this.controller)).showEntry(param);
    }

    protected async event(type:string, value?:any) {
        /*
        if (this._resolve_$_ !== undefined) {
            await this._resolve_$_({type:type, value:value});
            return;
        }*/
        await this.controller.event(type, value);
    }

    protected returnCall(value:any) {
        this.controller.returnCall(value);
    }

    protected openPage(view: React.StatelessComponent<any>, param?:any) {
        this.controller.openPage(React.createElement(view, param));
    }

    protected replacePage(view: React.StatelessComponent<any>, param?:any) {
        this.controller.replacePage(React.createElement(view, param));
    }

    protected openPageElement(page: JSX.Element) {
        this.controller.openPage(page);
    }

    protected replacePageElement(page: JSX.Element) {
        this.controller.replacePage(page);
    }

    protected backPage() {
        this.controller.backPage();
    }

    protected closePage(level?:number) {
        this.controller.closePage(level);
    }

    protected ceasePage(level?:number) {
        this.controller.ceasePage(level);
    }

    protected removeCeased() {
        this.controller.removeCeased();
    }

    protected regConfirmClose(confirmClose: ()=>Promise<boolean>) {
        this.controller.regConfirmClose(confirmClose);
    }
}

export abstract class VPage<C extends Controller> extends View<C> {
    constructor(coordinator: C) {
        super(coordinator);
    }

    abstract showEntry(param?:any):Promise<void>;

    render(param?:any):JSX.Element {return null;}
}

export type TypeVPage<C extends Controller> = new (coordinator: C)=>VPage<C>;

