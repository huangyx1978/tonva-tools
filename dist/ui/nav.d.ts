import * as React from 'react';
import { User } from '../user';
import { FetchError } from '../fetchError';
import { LocalData } from '../local';
import 'font-awesome/css/font-awesome.min.css';
import '../css/va-form.css';
import '../css/va.css';
import '../css/animation.css';
export declare const mobileHeaderStyle: {
    minHeight: string;
};
export interface Props {
    start?: () => Promise<void>;
    onLogined: () => Promise<void>;
    notLogined?: () => Promise<void>;
}
export interface StackItem {
    key: number;
    view: JSX.Element;
    ceased: boolean;
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
    show(view: JSX.Element, disposer?: () => void): number;
    push(view: JSX.Element, disposer?: () => void): number;
    replace(view: JSX.Element, disposer?: () => void): number;
    ceaseTop(level?: number): void;
    pop(level?: number): void;
    popTo(key: number): void;
    removeCeased(): void;
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
    private ws;
    private wsHost;
    local: LocalData;
    user: User;
    language: string;
    culture: string;
    constructor();
    set(nav: NavView): void;
    registerReceiveHandler(handler: (message: any) => Promise<void>): number;
    unregisterReceiveHandler(handlerId: number): void;
    onReceive(msg: any): Promise<void>;
    private isInFrame;
    start(): Promise<void>;
    showAppView(): Promise<void>;
    logined(user: User): Promise<void>;
    showLogin(withBack?: boolean): Promise<void>;
    logout(notShowLogin?: boolean): Promise<void>;
    readonly level: number;
    startWait(): void;
    endWait(): void;
    onError(error: FetchError): Promise<void>;
    show(view: JSX.Element, disposer?: () => void): void;
    push(view: JSX.Element, disposer?: () => void): void;
    replace(view: JSX.Element, disposer?: () => void): void;
    pop(level?: number): void;
    clear(): void;
    navBack(): void;
    ceaseTop(level?: number): void;
    removeCeased(): void;
    back(confirm?: boolean): Promise<void>;
    regConfirmClose(confirmClose: () => Promise<boolean>): void;
    confirmBox(message?: string): boolean;
    navToApp(url: string, unitId: number, apiId?: number, sheetType?: number, sheetId?: number): void;
    navToSite(url: string): void;
    readonly logs: string[];
    log(msg: string): void;
}
export declare const nav: Nav;
