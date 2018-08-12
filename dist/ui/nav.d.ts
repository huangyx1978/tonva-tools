import * as React from 'react';
import { User } from '../user';
import { FetchError } from '../fetchError';
import { LocalData } from '../local';
import 'font-awesome/css/font-awesome.min.css';
import '../css/va.css';
import '../css/animation.css';
export declare const mobileHeaderStyle: {
    minHeight: string;
};
export interface Props {
    start?: () => Promise<void>;
    onLogined: () => Promise<void>;
}
export interface StackItem {
    key: number;
    view: JSX.Element;
    confirmClose?: () => Promise<boolean>;
    disposer?: () => void;
}
export interface State {
    stack: StackItem[];
    wait: 0 | 1 | 2;
    fetchError: FetchError;
}
export declare class NavView extends React.Component<Props, State> {
    private stack;
    private htmlTitle;
    private waitCount;
    private waitTimeHandler?;
    constructor(props: any);
    componentWillMount(): Promise<void>;
    componentDidMount(): Promise<void>;
    readonly level: number;
    startWait(): void;
    endWait(): void;
    onError(fetchError: FetchError): Promise<void>;
    show(view: JSX.Element, disposer?: () => void): void;
    push(view: JSX.Element, disposer?: () => void): void;
    replace(view: JSX.Element, disposer?: () => void): void;
    pop(level?: Number): void;
    private popAndDispose;
    private dispose;
    clear(): void;
    regConfirmClose(confirmClose: () => Promise<boolean>): void;
    private isHistoryBack;
    navBack(): void;
    back(confirm?: boolean): Promise<void>;
    confirmBox(message?: string): boolean;
    clearError: () => void;
    render(): JSX.Element;
    private refresh;
}
export declare class Nav {
    private nav;
    private loginView;
    private ws;
    private wsHost;
    local: LocalData;
    user: User;
    set(nav: NavView): void;
    registerReceiveHandler(handler: (message: any) => Promise<void>): number;
    unregisterReceiveHandler(handlerId: number): void;
    private isInFrame;
    start(): Promise<void>;
    private showAppView;
    logined(user: User): Promise<void>;
    showLogin(): Promise<void>;
    logout(): Promise<void>;
    readonly level: number;
    startWait(): void;
    endWait(): void;
    onError(error: FetchError): Promise<void>;
    show(view: JSX.Element, disposer?: () => void): void;
    push(view: JSX.Element, disposer?: () => void): void;
    replace(view: JSX.Element, disposer?: () => void): void;
    pop(level?: Number): void;
    clear(): void;
    navBack(): void;
    back(confirm?: boolean): Promise<void>;
    regConfirmClose(confirmClose: () => Promise<boolean>): void;
    confirmBox(message?: string): boolean;
    navToApp(url: string, unitId: number, apiId?: number, sheetType?: number, sheetId?: number): void;
    navToSite(url: string): void;
    readonly logs: string[];
    log(msg: string): void;
}
export declare const nav: Nav;
