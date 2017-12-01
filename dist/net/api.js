"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const nav_1 = require("../ui/nav");
const httpChannel_1 = require("./httpChannel");
class HttpChannelNavUI {
    startWait() {
        nav_1.nav.startWait();
    }
    endWait() {
        nav_1.nav.endWait();
    }
    showError(error) {
        return __awaiter(this, void 0, void 0, function* () {
            nav_1.nav.endWait();
            /*
            if (error.name === 'SyntaxError') {
                error = {
                    name: error.name,
                    message: error.message,
                }
            }*/
            yield nav_1.nav.onError(error);
        });
    }
}
// 应该用上面的NavUI
const httpChannelNav = new httpChannel_1.HttpChannel(new HttpChannelNavUI());
function refetchApi(url, options, resolve, reject) {
    return __awaiter(this, void 0, void 0, function* () {
        yield httpChannelNav.fetch(url, options, resolve, reject);
    });
}
exports.refetchApi = refetchApi;
class ApiNav {
    constructor(path) {
        this.path = path || '';
    }
    get(path, params) {
        return httpChannelNav.get(this.path + path, params);
    }
    post(path, params) {
        return httpChannelNav.post(this.path + path, params);
    }
    put(path, params) {
        return httpChannelNav.put(this.path + path, params);
    }
    delete(path, params) {
        return httpChannelNav.delete(this.path + path, params);
    }
}
exports.ApiNav = ApiNav;
// 应该用上面的NavUI
const httpChannel = new httpChannel_1.HttpChannel();
class Api {
    constructor(path) {
        this.path = path || '';
    }
    get(path, params) {
        return httpChannel.get(this.path + path, params);
    }
    post(path, params) {
        return httpChannel.post(this.path + path, params);
    }
    put(path, params) {
        return httpChannel.put(this.path + path, params);
    }
    delete(path, params) {
        return httpChannel.delete(this.path + path, params);
    }
}
exports.Api = Api;
//# sourceMappingURL=api.js.map