/// <reference types="react" />
import * as React from 'react';
import { IComputedValue } from 'mobx';
import '../css/va-row.css';
export interface ListItem {
    key?: string | number;
    date?: Date;
    icon?: string | JSX.Element;
    main?: string;
    vice?: string;
    middle?: string | JSX.Element;
    midSize?: number;
    right?: string | JSX.Element;
    onClick?: () => void;
    unread?: number | IComputedValue<number>;
}
export interface ListRowProps extends ListItem {
}
export interface ListRowState {
    pressed: boolean;
}
export declare class ListRow extends React.Component<ListRowProps, ListRowState> {
    constructor(props: any);
    render(): JSX.Element;
}
