/// <reference types="react" />
import { TextWidget } from './textWidget';
export declare class CheckBoxWidget extends TextWidget {
    protected input: HTMLInputElement;
    protected setElementValue(value: any): void;
    setReadOnly(value: boolean): void;
    setDisabled(value: boolean): void;
    render(): JSX.Element;
}
