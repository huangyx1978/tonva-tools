import {observable} from 'mobx';

export abstract class PagedItems<T> {
    @observable items: T[] = null;
    @observable allLoaded: boolean = false;

    protected param: any;
    protected pageStart = undefined;
    protected pageSize = 30;
    protected appendPosition:'head'|'tail' = 'tail';

    protected abstract async load():Promise<T[]>;
    protected abstract setPageStart(item:T);

    append(item:T) {
        if (this.items === undefined) this.items = [];
        if (this.appendPosition === 'tail')
            this.items.push(item);
        else
            this.items.unshift(item);
    }

    async first(param:any):Promise<void> {
        this.param = param;
        this.items = undefined;
        this.allLoaded = false;
        this.setPageStart(undefined);
        await this.more();
    }

    async more():Promise<void> {
        if (this.allLoaded === true) return;
        let ret = await this.load();
        let len = ret.length;
        if (len > this.pageSize) {
            this.allLoaded = false;
            --len;
            ret.splice(len, 1);
        }
        else {
            this.allLoaded = true;
        }
        if (len === 0) {
            if (this.items === undefined) this.items = [];
            return;
        }
        this.setPageStart(ret[len-1]);
        if (this.items === undefined) {
            this.items = ret;
            return;
        }

        if (this.appendPosition === 'tail')
            this.items.push(...ret);
        else
            this.items.unshift(...ret.reverse());
    }
}
