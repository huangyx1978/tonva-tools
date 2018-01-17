export declare abstract class PagedItems<T> {
    items: T[];
    allLoaded: boolean;
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
