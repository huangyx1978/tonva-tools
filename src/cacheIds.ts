import {observable, computed} from 'mobx';

export interface Id {
    id: number;
}

export abstract class CacheIds<T extends Id> {
    constructor(maxCount:number = 100) {
        this.maxCount = maxCount;
    }
    private maxCount:number;
    private arr:T[] = [];
    @observable dict = new Map<number, T>();

    get(id:number):T {
        if (id === undefined) return null;
        let unit = this.dict.get(id);
        if (unit === undefined) {
            unit = {id:id} as T;
            this.dict.set(id, unit);
            this.loadId(id);
        }
        return unit;
    }
    private async loadId(id:number) {
        let item = await this._load(id);
        if (item === undefined) {
            this.dict.set(id, null);
            this.arr.push({id: id} as T);
        }
        else {
            this.dict.set(id, item);
            this.arr.push(item);
        }
        if (this.arr.length > this.maxCount) {
            item = this.arr.shift();
            this.dict.delete(item.id);
        }
    }

    protected abstract async _load(id:number):Promise<T>;
}
