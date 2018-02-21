import { IObservableArray } from 'mobx';
export declare abstract class PagedItems<T> {
    private loaded;
    private _items;
    allLoaded: boolean;
    readonly items: IObservableArray<T>;
    protected param: any;
    protected pageStart: any;
    protected pageSize: number;
    protected appendPosition: 'head' | 'tail';
    protected abstract load(): Promise<T[]>;
    protected abstract setPageStart(item: T): any;
    append(item: T): void;
    first(param: any): Promise<void>;
    more(): Promise<void>;
}
