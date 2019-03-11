import { UiTextItem } from '../schema';
import { ItemEdit } from './itemEdit';
export declare class ImageItemEdit extends ItemEdit {
    protected uiItem: UiTextItem;
    private resUploader;
    private resId;
    private overSize;
    protected internalStart(): Promise<any>;
    private upload;
    private page;
}
