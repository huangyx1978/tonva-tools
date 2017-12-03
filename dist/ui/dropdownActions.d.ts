/// <reference types="react" />
import * as React from 'react';
export interface Action {
    caption: string;
    action: () => void;
}
export interface DropdownActionsProps {
    actions: Action[];
}
export interface DropdownActionsState {
    dropdownOpen: boolean;
}
export declare class DropdownActions extends React.Component<DropdownActionsProps, DropdownActionsState> {
    constructor(props: any);
    toggle(): void;
    render(): JSX.Element;
}
