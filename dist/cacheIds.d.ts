export interface Id {
    id: number;
}
export declare abstract class CacheIds<T extends Id> {
    constructor(maxCount?: number);
    private maxCount;
    private arr;
    dict: Map<number, T>;
    get(id: number): T;
    private loadId(id);
    protected abstract _load(id: number): Promise<T>;
}
