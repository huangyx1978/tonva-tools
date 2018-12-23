import * as React from 'react';
import { Widget } from './widget';
import { UiTextItem } from '../uiSchema';
export declare class TextWidget extends Widget {
    protected inputType: string;
    protected ui: UiTextItem;
    protected input: HTMLInputElement;
    protected setElementValue(value: any): void;
    protected readonly placeholder: string;
    protected onKeyDown: (evt: React.KeyboardEvent<HTMLInputElement>) => void;
    protected onBlur: () => void;
    protected onFocus: () => void;
    setReadOnly(value: boolean): void;
    setDisabled(value: boolean): void;
    render(): JSX.Element;
}
