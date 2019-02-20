import * as React from 'react';
import { Widget } from './widget';
import { UiTextAreaItem } from '../../schema';
import { StringSchema } from '../../schema';
export declare class TextAreaWidget extends Widget {
    protected itemSchema: StringSchema;
    protected input: HTMLTextAreaElement;
    protected ui: UiTextAreaItem;
    protected setElementValue(value: any): void;
    protected onInputChange: (evt: React.ChangeEvent<HTMLTextAreaElement>) => void;
    setReadOnly(value: boolean): void;
    setDisabled(value: boolean): void;
    render(): JSX.Element;
}
