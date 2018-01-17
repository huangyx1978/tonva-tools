var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { observable } from 'mobx';
export class PagedItems {
    constructor() {
        this.items = null;
        this.allLoaded = false;
        this.pageStart = undefined;
        this.pageSize = 30;
        this.appendPosition = 'tail';
    }
    append(item) {
        if (this.items === undefined)
            this.items = [];
        if (this.appendPosition === 'tail')
            this.items.push(item);
        else
            this.items.unshift(item);
    }
    first(param) {
        return __awaiter(this, void 0, void 0, function* () {
            this.param = param;
            this.items = undefined;
            this.allLoaded = false;
            this.setPageStart(undefined);
            yield this.more();
        });
    }
    more() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.allLoaded === true)
                return;
            let ret = yield this.load();
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
                if (this.items === undefined)
                    this.items = [];
                return;
            }
            this.setPageStart(ret[len - 1]);
            if (this.items === undefined) {
                this.items = ret;
                return;
            }
            if (this.appendPosition === 'tail')
                this.items.push(...ret);
            else
                this.items.unshift(...ret.reverse());
        });
    }
}
__decorate([
    observable
], PagedItems.prototype, "items", void 0);
__decorate([
    observable
], PagedItems.prototype, "allLoaded", void 0);
//# sourceMappingURL=pagedItems.js.map