export interface Id {
    id: number;
}
export declare abstract class CacheIds<T extends Id> {
    constructor(maxCount?: number);
    private maxCount;
    private arr;
    dict: Map<number, T>;
    loadIds(ids: number[]): void;
    get(id: number): T;
    private setItem;
    private loadId;
    protected abstract _loadIds(ids: number[]): Promise<T[]>;
    protected abstract _loadId(id: number): Promise<T>;
}
