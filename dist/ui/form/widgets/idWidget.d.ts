/// <reference types="react" />
import { Widget } from './widget';
import { UiIdItem } from '../../schema';
export declare class IdWidget extends Widget {
    protected ui: UiIdItem;
    protected value: number;
    setReadOnly(value: boolean): void;
    setDisabled(value: boolean): void;
    protected onClick: () => Promise<void>;
    render(): JSX.Element;
}
