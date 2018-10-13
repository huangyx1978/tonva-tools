import * as React from 'react';
import { nav } from './nav';
import { Page } from './page';
export class Controller {
    constructor(res) {
        this.isDev = process.env.NODE_ENV === 'development';
        this.disposer = () => {
            // message listener的清理
            nav.unregisterReceiveHandler(this.receiveHandlerId);
        };
        this.onMessageReceive = async (message) => {
            await this.onMessage(message);
        };
        this._resolve_$ = [];
        this.res = res || {}; // || entityUI.res;
        this.x = this.res.x || {};
    }
    async showVPage(vp, param) {
        await (new vp(this)).showEntry(param);
    }
    renderView(view, param) {
        return (new view(this)).render(param);
    }
    async event(type, value) {
        await this.onEvent(type, value);
    }
    async onEvent(type, value) {
    }
    msg(text) {
        alert(text);
    }
    errorPage(header, err) {
        this.openPage(React.createElement(Page, { header: "App error!" },
            React.createElement("pre", null, typeof err === 'string' ? err : err.message)));
    }
    onMessage(message) {
        return;
    }
    async beforeStart() {
        this.receiveHandlerId = nav.registerReceiveHandler(this.onMessageReceive);
    }
    async start(param) {
        await this.beforeStart();
        await this.internalStart(param);
    }
    async call(param) {
        return new Promise(async (resolve, reject) => {
            this._resolve_$.push(resolve);
            await this.start(param);
        });
    }
    async vCall(vp, param) {
        return new Promise(async (resolve, reject) => {
            this._resolve_$.push(resolve);
            await (new vp(this)).showEntry(param);
        });
    }
    return(value) {
        let resolve = this._resolve_$.pop();
        if (resolve === undefined) {
            alert('the Coordinator call already returned, or not called');
            return;
        }
        resolve(value);
    }
    openPage(page) {
        nav.push(page, this.disposer);
        this.disposer = undefined;
    }
    replacePage(page) {
        nav.replace(page, this.disposer);
        this.disposer = undefined;
    }
    backPage() {
        nav.back();
    }
    closePage(level) {
        nav.pop(level);
    }
    ceasePage(level) {
        nav.ceaseTop(level);
    }
    regConfirmClose(confirmClose) {
        nav.regConfirmClose(confirmClose);
    }
}
export class View {
    constructor(controller) {
        this.controller = controller;
        this.res = controller.res;
        this.x = controller.x;
    }
    get isDev() { return this.controller.isDev; }
    renderVm(vm, param) {
        return (new vm(this.controller)).render(param);
    }
    async showVPage(vp, param) {
        await (new vp(this.controller)).showEntry(param);
    }
    async event(type, value) {
        /*
        if (this._resolve_$_ !== undefined) {
            await this._resolve_$_({type:type, value:value});
            return;
        }*/
        await this.controller.event(type, value);
    }
    return(value) {
        this.controller.return(value);
    }
    openPage(view, param) {
        this.controller.openPage(React.createElement(view, param));
    }
    replacePage(view, param) {
        this.controller.replacePage(React.createElement(view, param));
    }
    openPageElement(page) {
        this.controller.openPage(page);
    }
    replacePageElement(page) {
        this.controller.replacePage(page);
    }
    backPage() {
        this.controller.backPage();
    }
    closePage(level) {
        this.controller.closePage(level);
    }
    ceasePage(level) {
        this.controller.ceasePage(level);
    }
    regConfirmClose(confirmClose) {
        this.controller.regConfirmClose(confirmClose);
    }
}
export class VPage extends View {
    constructor(coordinator) {
        super(coordinator);
    }
    render(param) { return null; }
}
//# sourceMappingURL=VM.js.map