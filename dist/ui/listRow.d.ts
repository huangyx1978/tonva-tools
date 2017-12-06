/// <reference types="react" />
import * as React from 'react';
import '../css/va-row.css';
export interface ListItem {
    key?: string | number | undefined;
    date?: Date;
    icon?: string | JSX.Element;
    main?: string;
    vice?: string;
    right?: string | JSX.Element;
    unread?: number;
    onClick?: () => void;
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
