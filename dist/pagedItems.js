var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { observable, computed } from 'mobx';
import { uid } from './uid';
export class PagedItems {
    constructor(itemObservable = false) {
        this.beforeLoad = true;
        this.loaded = false;
        this.allLoaded = false;
        this.pageStart = undefined;
        this.pageSize = 30;
        this.appendPosition = 'tail';
        this._items = observable.array([], { deep: itemObservable });
    }
    get items() {
        if (this.beforeLoad === true)
            return null;
        if (this.loaded === false)
            return undefined;
        return this._items;
    }
    scrollToTop() {
        this.topDiv = '$$' + uid();
    }
    scrollToBottom() {
        this.bottomDiv = '$$' + uid();
    }
    reset() {
        this.beforeLoad = true;
        this.loaded = false;
        this.param = undefined;
        this.allLoaded = false;
        this._items.clear();
        this.setPageStart(undefined);
    }
    append(item) {
        if (this.appendPosition === 'tail')
            this._items.unshift(item);
        else
            this._items.push(item);
    }
    async first(param) {
        this.reset();
        this.beforeLoad = false;
        this.param = param;
        /*
        this.loaded = false;
        this._items.clear();
        this.allLoaded = false;
        this.setPageStart(undefined);
        */
        await this.more();
    }
    async more() {
        if (this.allLoaded === true)
            return;
        let ret = await this.load();
        this.loaded = true;
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
            this._items.clear();
            return;
        }
        this.setPageStart(ret[len - 1]);
        if (this.appendPosition === 'tail')
            this._items.push(...ret);
        else
            this._items.unshift(...ret.reverse());
    }
}
__decorate([
    observable
], PagedItems.prototype, "beforeLoad", void 0);
__decorate([
    observable
], PagedItems.prototype, "loaded", void 0);
__decorate([
    observable
], PagedItems.prototype, "allLoaded", void 0);
__decorate([
    computed
], PagedItems.prototype, "items", null);
__decorate([
    observable
], PagedItems.prototype, "topDiv", void 0);
__decorate([
    observable
], PagedItems.prototype, "bottomDiv", void 0);
//# sourceMappingURL=pagedItems.js.map