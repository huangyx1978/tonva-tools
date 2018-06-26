import * as React from 'react';
import { FetchError } from '../fetchError';
export interface FetchErrorProps extends FetchError {
    clearError: () => void;
}
export default class FetchErrorView extends React.Component<FetchErrorProps, null> {
    private click;
    render(): JSX.Element;
}
