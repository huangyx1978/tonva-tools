import * as React from 'react';
import { IComputedValue } from 'mobx';
export interface ScrollProps {
    onScroll?: (e: any) => void;
    onScrollTop?: () => void;
    onScrollBottom?: () => void;
}
export interface Tab extends ScrollProps {
    title: string;
    icon?: string;
    content?: JSX.Element | (() => JSX.Element);
    header?: string;
    isSelected?: boolean;
    redDot?: IComputedValue<number>;
    load?: () => Promise<void>;
}
export interface TabState extends Tab {
    isMounted?: boolean;
}
export interface PageProps extends ScrollProps {
    back?: 'close' | 'back' | 'none';
    header?: boolean | string | JSX.Element;
    keepHeader?: boolean;
    right?: JSX.Element;
    sideBar?: JSX.Element;
    footer?: JSX.Element;
    tabs?: Tab[];
    logout?: boolean | (() => Promise<void>);
    headerClassName?: string;
}
export interface PageState {
    cur?: Tab;
    tabs?: TabState[];
}
export declare class Page extends React.Component<PageProps, PageState> {
    private tabs;
    constructor(props: PageProps);
    componentDidMount(): Promise<void>;
    private onTabClick;
    private onTouchStart;
    private renderTabs;
    private renderSingle;
    render(): JSX.Element;
}
