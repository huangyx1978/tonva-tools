import { UiTextItem } from '../schema';
import { ItemEdit } from './itemEdit';
export declare class StringItemEdit extends ItemEdit {
    protected uiItem: UiTextItem;
    protected internalStart(): Promise<any>;
    private onChange;
    private onBlur;
    private onFocus;
    private page;
}
