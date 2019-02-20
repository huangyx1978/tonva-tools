import * as React from 'react';
import { Widget } from './widget';
import { UiCheckItem } from '../../schema';
export declare class CheckBoxWidget extends Widget {
    protected input: HTMLInputElement;
    protected ui: UiCheckItem;
    protected trueValue: any;
    protected falseValue: any;
    protected init(): void;
    protected setElementValue(value: any): void;
    setReadOnly(value: boolean): void;
    setDisabled(value: boolean): void;
    protected onInputChange: (evt: React.ChangeEvent<HTMLInputElement>) => void;
    protected onClick: () => void;
    render(): JSX.Element;
}
