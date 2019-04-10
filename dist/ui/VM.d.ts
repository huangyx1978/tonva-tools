import * as React from 'react';
import { User } from '../user';
export declare abstract class Controller {
    readonly res: any;
    readonly x: any;
    icon: string | JSX.Element;
    label: string;
    readonly isDev: boolean;
    readonly user: User;
    readonly isLogined: boolean;
    constructor(res: any);
    private receiveHandlerId;
    private disposer;
    private dispose;
    protected onDispose(): void;
    protected openVPage<C extends Controller>(vp: new (controller: C) => VPage<C>, param?: any): Promise<void>;
    protected renderView<C extends Controller>(view: new (controller: C) => View<C>, param?: any): JSX.Element;
    event(type: string, value: any): Promise<void>;
    protected onEvent(type: string, value: any): Promise<void>;
    protected msg(text: string): void;
    protected errorPage(header: string, err: any): void;
    protected onMessage(message: any): Promise<void>;
    private onMessageReceive;
    protected beforeStart(): Promise<boolean>;
    protected registerReceiveHandler(): void;
    protected abstract internalStart(param?: any): Promise<void>;
    start(param?: any): Promise<void>;
    readonly isCalling: boolean;
    private _resolve_$;
    call<T>(param?: any): Promise<T>;
    vCall<C extends Controller>(vp: new (controller: C) => VPage<C>, param?: any): Promise<any>;
    returnCall(value: any): void;
    openPage(page: JSX.Element): void;
    replacePage(page: JSX.Element): void;
    backPage(): void;
    closePage(level?: number): void;
    ceasePage(level?: number): void;
    removeCeased(): void;
    regConfirmClose(confirmClose: () => Promise<boolean>): void;
}
export declare abstract class View<C extends Controller> {
    protected controller: C;
    protected readonly res: any;
    protected readonly x: any;
    constructor(controller: C);
    protected readonly isDev: boolean;
    abstract render(param?: any): JSX.Element;
    protected renderVm(vm: new (controller: C) => View<C>, param?: any): JSX.Element;
    protected openVPage(vp: new (controller: C) => VPage<C>, param?: any): Promise<void>;
    protected event(type: string, value?: any): Promise<void>;
    vCall<C extends Controller>(vp: new (controller: C) => VPage<C>, param?: any): Promise<any>;
    protected returnCall(value: any): void;
    protected openPage(view: React.StatelessComponent<any>, param?: any): void;
    protected replacePage(view: React.StatelessComponent<any>, param?: any): void;
    protected openPageElement(page: JSX.Element): void;
    protected replacePageElement(page: JSX.Element): void;
    protected backPage(): void;
    protected closePage(level?: number): void;
    protected ceasePage(level?: number): void;
    protected removeCeased(): void;
    protected regConfirmClose(confirmClose: () => Promise<boolean>): void;
}
export declare abstract class VPage<C extends Controller> extends View<C> {
    abstract open(param?: any): Promise<void>;
    render(param?: any): JSX.Element;
}
export declare type TypeVPage<C extends Controller> = new (controller: C) => VPage<C>;
