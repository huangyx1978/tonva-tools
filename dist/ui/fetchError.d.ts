/// <reference types="react" />
import * as React from 'react';
export interface FetchError {
    url: string;
    options: any;
    resolve: (value?: any) => void;
    reject: (reason?: any) => void;
    error: any;
}
export interface FetchErrorProps extends FetchError {
    clearError: () => void;
}
export default class FetchErrorView extends React.Component<FetchErrorProps, null> {
    private click();
    render(): JSX.Element;
}
