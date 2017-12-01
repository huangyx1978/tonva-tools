/// <reference types="react" />
import * as React from 'react';
export interface ListViewProps {
    className?: string;
    items: any[];
    mapper: (item: any, index: number, ex?: any) => JSX.Element;
    ex?: any;
    header?: string | JSX.Element;
    unload?: string | JSX.Element;
    none?: string | JSX.Element;
    footer?: string | JSX.Element;
}
export declare class ListView extends React.Component<ListViewProps, null> {
    render(): JSX.Element;
}
