import * as React from 'react';
import { Schema, UiSchema, ItemSchema, UiItem } from '../schema';
export interface EditProps {
    className?: string;
    schema: Schema;
    data: any;
    onItemClick?: (itemSchema: ItemSchema, uiItem: UiItem, value: any) => Promise<void>;
    onItemChanged?: (itemSchema: ItemSchema, newValue: any, preValue: any) => Promise<void>;
    stopEdit?: boolean;
    uiSchema?: UiSchema;
    sepClassName?: string;
    topBorderClassName?: string;
    bottomBorderClassName?: string;
    rowContainerClassName?: string;
}
export declare class Edit extends React.Component<EditProps> {
    private defaultSepClassName;
    private defaultRowContainerClassName;
    private topBorder;
    private bottomBorder;
    private rowContainerClassName?;
    private sep;
    private uiSchema;
    constructor(props: EditProps);
    render(): JSX.Element;
    private renderRow;
    private rowClick;
}
