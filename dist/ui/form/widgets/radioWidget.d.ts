/// <reference types="react" />
import { Widget } from './widget';
import { UiRadio } from '../../schema';
export declare class RadioWidget extends Widget {
    protected inputs: {
        [index: number]: HTMLInputElement;
    };
    protected ui: UiRadio;
    protected setElementValue(value: any): void;
    setReadOnly(value: boolean): void;
    setDisabled(value: boolean): void;
    render(): JSX.Element;
}
