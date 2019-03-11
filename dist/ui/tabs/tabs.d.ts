import * as React from 'react';
import { IObservableValue } from 'mobx/lib/internal';
export declare type TabCaption = (selected: boolean) => JSX.Element;
export interface TabProp {
    name: string;
    caption: TabCaption;
    content: () => JSX.Element;
    notify?: IObservableValue<number>;
}
export interface TabsProps {
    tabs: TabProp[];
    size?: 'sm' | 'lg' | 'md';
    tabBack?: string;
    contentBack?: string;
    sep?: string;
    selected?: string;
}
export declare const TabCaptionComponent: (label: string, icon: string, color: string) => JSX.Element;
export declare class Tabs extends React.Component<TabsProps> {
    private size;
    private tabBack;
    private contentBack;
    private sep;
    private selectedTab;
    private tabs;
    constructor(props: TabsProps);
    private tabClick;
    showTab(tabName: string): void;
    render(): JSX.Element;
}
