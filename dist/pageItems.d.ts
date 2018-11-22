import { IObservableArray } from 'mobx';
export declare abstract class PageItems<T> {
    constructor(itemObservable?: boolean);
    private isFirst;
    loading: boolean;
    private beforeLoad;
    protected loaded: boolean;
    protected _items: IObservableArray<T>;
    allLoaded: boolean;
    readonly items: IObservableArray<T>;
    topDiv: string;
    bottomDiv: string;
    scrollToTop(): void;
    scrollToBottom(): void;
    protected param: any;
    protected firstSize: number;
    protected pageStart: any;
    protected pageSize: number;
    protected appendPosition: 'head' | 'tail';
    protected abstract load(param: any, pageStart: any, pageSize: number): Promise<T[]>;
    protected abstract setPageStart(item: T): any;
    reset(): void;
    append(item: T): void;
    first(param: any): Promise<void>;
    more(): Promise<void>;
}
