import * as React from 'react';
export interface PageHeaderProps {
    back?: 'back' | 'close' | 'none';
    center: string | JSX.Element;
    right?: JSX.Element;
    logout?: boolean | (() => Promise<void>);
    className?: string;
}
export interface PageHeaderState {
    hasBack: boolean;
}
export declare class PageHeader extends React.Component<PageHeaderProps, PageHeaderState> {
    constructor(props: PageHeaderProps);
    navChange(): void;
    componentWillMount(): void;
    componentWillUnmount(): void;
    back(): Promise<void>;
    openWindow(): void;
    private logoutClick;
    private logout;
    render(): JSX.Element;
}
