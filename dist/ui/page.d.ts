/// <reference types="react" />
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
    content?: JSX.Element;
    header?: string;
    isSelected?: boolean;
    redDot?: IComputedValue<number>;
}
export interface TabState extends Tab {
    isMounted?: boolean;
}
export interface PageProps extends ScrollProps {
    back?: 'close' | 'back' | 'none';
    header?: boolean | string | JSX.Element;
    right?: JSX.Element;
    footer?: JSX.Element;
    tabs?: Tab[];
    debugLogout?: boolean;
}
export interface PageState {
    cur?: Tab;
    tabs?: TabState[];
}
export declare class Page extends React.Component<PageProps, PageState> {
    private tabs;
    constructor(props: PageProps);
    private onTabClick(tab);
    private renderTabs(footer);
    private renderSingle(footer);
    render(): JSX.Element;
}
