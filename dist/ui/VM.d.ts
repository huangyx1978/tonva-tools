import * as React from 'react';
export declare abstract class Controller {
    icon: string | JSX.Element;
    label: string;
    private receiveHandlerId;
    private disposer;
    protected showVPage(vp: new (coordinator: Controller) => VPage<Controller>, param?: any): Promise<void>;
    protected renderView(view: new (coordinator: Controller) => View<Controller>, param?: any): JSX.Element;
    event(type: string, value: any): Promise<void>;
    protected onEvent(type: string, value: any): Promise<void>;
    protected msg(text: string): void;
    protected errorPage(header: string, err: any): void;
    protected onMessage(message: any): Promise<void>;
    private onMessageReceive;
    protected beforeStart(): Promise<void>;
    protected abstract internalStart(param?: any): Promise<void>;
    start(param?: any): Promise<void>;
    private _resolve_$;
    call(param?: any): Promise<any>;
    return(value: any): void;
    openPage(page: JSX.Element): void;
    replacePage(page: JSX.Element): void;
    backPage(): void;
    closePage(level?: number): void;
    regConfirmClose(confirmClose: () => Promise<boolean>): void;
}
export declare abstract class View<C extends Controller> {
    protected controller: C;
    constructor(controller: C);
    abstract render(param?: any): JSX.Element;
    protected renderVm(vm: new (coordinator: Controller) => View<C>, param?: any): JSX.Element;
    protected event(type: string, value?: any): Promise<void>;
    protected return(value: any): void;
    protected openPage(view: React.StatelessComponent<any>, param?: any): void;
    protected replacePage(view: React.StatelessComponent<any>, param?: any): void;
    protected openPageElement(page: JSX.Element): void;
    protected replacePageElement(page: JSX.Element): void;
    protected backPage(): void;
    protected closePage(level?: number): void;
    protected regConfirmClose(confirmClose: () => Promise<boolean>): void;
}
export declare abstract class VPage<C extends Controller> extends View<C> {
    constructor(coordinator: C);
    abstract showEntry(param?: any): Promise<void>;
    render(param?: any): JSX.Element;
}
export declare type TypeVPage<C extends Controller> = new (coordinator: C) => VPage<C>;
//# sourceMappingURL=VM.d.ts.map