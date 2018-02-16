/// <reference types="react" />
import * as React from 'react';
import { User } from '../user';
import { FetchError } from '../fetchError';
import { LocalData } from '../local';
import 'font-awesome/css/font-awesome.min.css';
import '../css/va.css';
export interface Props {
    view: JSX.Element | (() => JSX.Element);
}
export interface StackItem {
    view: JSX.Element;
    confirmClose?: () => boolean;
}
export interface State {
    stack: StackItem[];
    wait: boolean;
    fetchError: FetchError;
}
export declare class NavView extends React.Component<Props, State> {
    private stack;
    private htmlTitle;
    private waitCount;
    private waitTimeHandler?;
    constructor(props: any);
    componentDidMount(): Promise<void>;
    readonly level: Number;
    showAppView(): void;
    startWait(): void;
    endWait(): void;
    onError(fetchError: FetchError): Promise<void>;
    show(view: JSX.Element): void;
    push(view: JSX.Element): void;
    replace(view: JSX.Element): void;
    pop(level?: Number): void;
    clear(): void;
    regConfirmClose(confirmClose: () => boolean): void;
    back(confirm?: boolean): void;
    confirmBox(message?: string): boolean;
    render(): JSX.Element;
    private refresh();
    private renderAndPush(view);
}
export declare class Nav {
    private nav;
    private loginView;
    local: LocalData;
    user: User;
    set(nav: NavView): void;
    logined(user: User): Promise<void>;
    showLogin(): Promise<void>;
    logout(): Promise<void>;
    readonly level: Number;
    startWait(): void;
    endWait(): void;
    onError(error: FetchError): Promise<void>;
    show(view: JSX.Element): void;
    push(view: JSX.Element): void;
    replace(view: JSX.Element): void;
    pop(level?: Number): void;
    clear(): void;
    back(confirm?: boolean): void;
    regConfirmClose(confirmClose: () => boolean): void;
    confirmBox(message?: string): boolean;
    navToApp(url: string, unitId: number, appId: number): void;
    navToSite(url: string): void;
}
export declare const nav: Nav;
