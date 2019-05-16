import { UiRadio } from '../schema';
import { ItemEdit } from './itemEdit';
export declare class RadioItemEdit extends ItemEdit {
    protected uiItem: UiRadio;
    protected internalStart(): Promise<any>;
    private onChange;
    private page;
}
