/// <reference types="react" />
import * as React from 'react';
export interface LabelRowProps {
    label: string;
    className?: string;
    action?: () => void;
}
export interface LabelRowState {
    isPressed: boolean;
}
export declare class LabelRow extends React.Component<LabelRowProps, LabelRowState> {
    constructor(props: any);
    mouseDown(): void;
    mouseUp(): void;
    render(): JSX.Element;
}
export interface ActionRowProps {
    className?: string;
    action?: () => void;
}
export interface ActionRowState {
    isPressed: boolean;
}
export declare class ActionRow extends React.Component<ActionRowProps, ActionRowState> {
    constructor(props: any);
    mouseDown(): void;
    mouseUp(): void;
    render(): JSX.Element;
}
