/// <reference types="react" />
import * as React from 'react';
import { FormSchema } from './formSchema';
export interface MenuItem {
    caption: string;
    action: () => void;
}
export interface FormPageProps {
    close?: boolean;
    header?: boolean | string | JSX.Element;
    rightMenu?: MenuItem[];
    footer?: JSX.Element;
    formSchema: FormSchema;
}
export interface FormPageState {
    dropdownOpen: boolean;
}
export declare class FormPage extends React.Component<FormPageProps, FormPageState> {
    constructor(props: any);
    toggle(): void;
    renderMenu(menuItems: MenuItem[]): JSX.Element;
    render(): JSX.Element;
}
