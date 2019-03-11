import * as React from 'react';
export interface TitleBarProps {
    back?: 'back' | 'close' | 'none';
    center: string | JSX.Element;
    right?: JSX.Element;
    logout?: boolean | (() => Promise<void>);
}
export interface TitleBarState {
    hasBack: boolean;
}
export declare class TitleBar extends React.Component<TitleBarProps, TitleBarState> {
    private navChangeHandler;
    constructor(props: any);
    navChange(): void;
    componentWillMount(): void;
    componentWillUnmount(): void;
    back(): Promise<void>;
    openWindow(): void;
    private logoutClick;
    private logout;
    render(): JSX.Element;
}
