/// <reference types="react" />
import * as React from 'react';
export interface TitleBarProps {
    back?: 'back' | 'close' | 'none';
    center: string | JSX.Element;
    right?: JSX.Element;
    logout?: () => void;
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
