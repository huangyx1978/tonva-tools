/// <reference types="react" />
import * as React from 'react';
import { User } from './user';
import { FetchError } from '../fetchError';
import 'font-awesome/css/font-awesome.min.css';
import '../css/va.css';
export interface Props {
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
    componentDidMount(): void;
    readonly level: Number;
    startWait(): void;
    endWait(): void;
    onError(fetchError: FetchError): void;
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
    private appView;
    local: LocalData;
    user: User;
    setViews(loginView: JSX.Element, appView: JSX.Element): void;
    set(nav: NavView): void;
    logined(user: User): void;
    showLogin(): void;
    logout(): void;
    readonly level: Number;
    startWait(): void;
    endWait(): void;
    onError(error: FetchError): void;
    show(view: JSX.Element): void;
    push(view: JSX.Element): void;
    replace(view: JSX.Element): void;
    pop(level?: Number): void;
    clear(): void;
    back(confirm?: boolean): void;
    regConfirmClose(confirmClose: () => boolean): void;
    confirmBox(message?: string): boolean;
    navToApp(url: string): void;
    private showApp(url);
}
export interface ClearableData {
    clear(): void;
}
export declare class Data<T> implements ClearableData {
    private name;
    private value?;
    constructor(name: string);
    get(): T;
    set(value: T): void;
    clear(): void;
}
export declare class LocalData {
    user: Data<User>;
    homeTabCur: Data<number>;
    logoutClear(): void;
}
export declare const nav: Nav;
