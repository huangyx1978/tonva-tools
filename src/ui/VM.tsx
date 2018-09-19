import * as React from 'react';
import {nav} from './nav';
import {Page} from './page';

export abstract class Controller {
    icon: string|JSX.Element;
    label:string;

    private receiveHandlerId:number;
    private disposer = () => {
        // message listener的清理
        nav.unregisterReceiveHandler(this.receiveHandlerId);
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
    protected async beforeStart() {
        this.receiveHandlerId = nav.registerReceiveHandler(this.onMessageReceive);
    }
    protected abstract internalStart(param?:any):Promise<void>;
    async start(param?:any):Promise<void> {
        await this.beforeStart();
        await this.internalStart(param);
    }

    private _resolve_$:(value:any) => void;
    async call(param?:any):Promise<any> {
        return new Promise<any> (async (resolve, reject) => {
            this._resolve_$ = resolve;
            await this.start(param);
        });
    }

    return(value:any) {
        if (this._resolve_$ === undefined) {
            alert('the Coordinator call already returned, or not called');
            return;
        }
        this._resolve_$(value);
        this._resolve_$ = undefined;
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

    regConfirmClose(confirmClose: ()=>Promise<boolean>) {
        nav.regConfirmClose(confirmClose);
    }
}


export abstract class View<C extends Controller> {
    protected controller: C;

    constructor(controller: C) {
        this.controller = controller;
    }

    abstract render(param?:any): JSX.Element;

    protected renderVm(vm: new (coordinator: Controller)=>View<C>, param?:any) {
        return (new vm(this.controller)).render(param);
    }

    protected async event(type:string, value?:any) {
        /*
        if (this._resolve_$_ !== undefined) {
            await this._resolve_$_({type:type, value:value});
            return;
        }*/
        await this.controller.event(type, value);
    }

    protected return(value:any) {
        this.controller.return(value);
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

