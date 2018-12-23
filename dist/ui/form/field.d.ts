import * as React from 'react';
import { Context } from './context';
export interface FieldProps {
    name: string;
}
export declare class Field extends React.Component<FieldProps> {
    static contextType: React.Context<Context>;
    render(): JSX.Element;
}
