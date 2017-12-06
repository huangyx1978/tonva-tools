/// <reference types="react" />
import * as React from 'react';
import { ListItem } from './listRow';
export interface ListViewProps {
    className?: string;
    items?: any[];
    renderRow?: (item: any, index: number, ex?: any) => JSX.Element;
    ex?: any;
    header?: string | JSX.Element;
    unload?: string | JSX.Element;
    none?: string | JSX.Element;
    footer?: string | JSX.Element;
    itemClick?: (item: any) => void;
    converter?: (item: any) => ListItem;
}
export declare class ListView extends React.Component<ListViewProps, null> {
    render(): JSX.Element;
}
