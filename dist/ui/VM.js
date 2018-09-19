var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as React from 'react';
import { nav } from './nav';
import { Page } from './page';
export class Controller {
    constructor() {
        this.disposer = () => {
            // message listener的清理
            nav.unregisterReceiveHandler(this.receiveHandlerId);
        };
        this.onMessageReceive = (message) => __awaiter(this, void 0, void 0, function* () {
            yield this.onMessage(message);
        });
    }
    showVPage(vp, param) {
        return __awaiter(this, void 0, void 0, function* () {
            yield (new vp(this)).showEntry(param);
        });
    }
    renderView(view, param) {
        return (new view(this)).render(param);
    }
    event(type, value) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.onEvent(type, value);
        });
    }
    onEvent(type, value) {
        return __awaiter(this, void 0, void 0, function* () {
        });
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
    beforeStart() {
        return __awaiter(this, void 0, void 0, function* () {
            this.receiveHandlerId = nav.registerReceiveHandler(this.onMessageReceive);
        });
    }
    start(param) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.beforeStart();
            yield this.internalStart(param);
        });
    }
    call(param) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                this._resolve_$ = resolve;
                yield this.start(param);
            }));
        });
    }
    return(value) {
        if (this._resolve_$ === undefined) {
            alert('the Coordinator call already returned, or not called');
            return;
        }
        this._resolve_$(value);
        this._resolve_$ = undefined;
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
    regConfirmClose(confirmClose) {
        nav.regConfirmClose(confirmClose);
    }
}
export class View {
    constructor(controller) {
        this.controller = controller;
    }
    renderVm(vm, param) {
        return (new vm(this.controller)).render(param);
    }
    event(type, value) {
        return __awaiter(this, void 0, void 0, function* () {
            /*
            if (this._resolve_$_ !== undefined) {
                await this._resolve_$_({type:type, value:value});
                return;
            }*/
            yield this.controller.event(type, value);
        });
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