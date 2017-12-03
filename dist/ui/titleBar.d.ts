/// <reference types="react" />
import * as React from 'react';
export interface TitleBarProps {
    close?: boolean;
    center: string | JSX.Element;
    right?: JSX.Element;
    debugLogout?: boolean;
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
    back(): void;
    render(): JSX.Element;
}
