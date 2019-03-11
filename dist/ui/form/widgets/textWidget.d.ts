import * as React from 'react';
import { Widget } from './widget';
import { UiTextItem } from '../../schema';
export declare class TextWidget extends Widget {
    protected inputType: string;
    protected ui: UiTextItem;
    protected input: HTMLInputElement;
    protected setElementValue(value: any): void;
    protected readonly placeholder: string;
    protected onKeyDown: (evt: React.KeyboardEvent<HTMLInputElement>) => Promise<void>;
    protected internalOnKeyDown(evt: React.KeyboardEvent<HTMLInputElement>): void;
    protected onBlur(evt: React.FocusEvent<any>): void;
    protected onFocus(evt: React.FocusEvent<any>): void;
    protected onChange(evt: React.ChangeEvent<any>): void;
    setReadOnly(value: boolean): void;
    setDisabled(value: boolean): void;
    render(): JSX.Element;
}
