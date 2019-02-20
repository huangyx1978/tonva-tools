import * as React from 'react';
import { Widget } from './widget';
import { UiSelect } from '../../schema';
export declare class SelectWidget extends Widget {
    protected select: HTMLSelectElement;
    protected ui: UiSelect;
    protected readOnly: boolean;
    protected setElementValue(value: any): void;
    protected onInputChange: (evt: React.ChangeEvent<HTMLSelectElement>) => void;
    setReadOnly(value: boolean): void;
    setDisabled(value: boolean): void;
    render(): JSX.Element;
}
