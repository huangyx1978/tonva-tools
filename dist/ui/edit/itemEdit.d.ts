import { ItemSchema, UiItem } from '../schema';
export declare abstract class ItemEdit {
    protected name: string;
    protected itemSchema: ItemSchema;
    protected uiItem: UiItem;
    protected value: any;
    protected label: string;
    protected error: string;
    protected isChanged: boolean;
    protected newValue: any;
    constructor(itemSchema: ItemSchema, uiItem: UiItem, label: string, value: any);
    start(): Promise<any>;
    protected abstract internalStart(): Promise<any>;
    end(): Promise<any>;
    protected internalEnd(): Promise<void>;
    protected verifyValue(): void;
}
