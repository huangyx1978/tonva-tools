/// <reference types="react" />
import { UiRange } from '../../schema';
import { Widget } from './widget';
export declare class RangeWidget extends Widget {
    protected inputType: string;
    protected input: HTMLInputElement;
    protected ui: UiRange;
    setReadOnly(value: boolean): void;
    setDisabled(value: boolean): void;
    render(): JSX.Element;
}
