var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export function refetchApi(channel, url, options, resolve, reject) {
    return __awaiter(this, void 0, void 0, function* () {
        yield channel.fetch(url, options, resolve, reject);
    });
}
export class ApiBase {
    constructor(path, showWaiting) {
        this.path = path || '';
        this.showWaiting = showWaiting;
    }
    call(url, method, body) {
        return __awaiter(this, void 0, void 0, function* () {
            let channel = yield this.getHttpChannel();
            return yield channel.callFetch(url, method, body);
        });
    }
    get(path, params) {
        return __awaiter(this, void 0, void 0, function* () {
            let channel = yield this.getHttpChannel();
            return yield channel.get(this.path + path, params);
        });
    }
    post(path, params) {
        return __awaiter(this, void 0, void 0, function* () {
            let channel = yield this.getHttpChannel();
            return yield channel.post(this.path + path, params);
        });
    }
    put(path, params) {
        return __awaiter(this, void 0, void 0, function* () {
            let channel = yield this.getHttpChannel();
            return yield channel.put(this.path + path, params);
        });
    }
    delete(path, params) {
        return __awaiter(this, void 0, void 0, function* () {
            let channel = yield this.getHttpChannel();
            return yield channel.delete(this.path + path, params);
        });
    }
}
export function getUrlOrDebug(url, urlDebug) {
    return __awaiter(this, void 0, void 0, function* () {
        if (urlDebug === undefined ||
            document.location.hostname !== 'localhost') {
            // return url;
        }
        try {
            if (urlDebug.endsWith('/') === false)
                urlDebug += '/';
            let ret = yield fetch(urlDebug + 'hello', {
                method: "GET",
                mode: "no-cors",
                headers: {
                    "Content-Type": "text/plain"
                },
            });
            let text = yield ret.text();
            return urlDebug;
        }
        catch (_a) {
            console.log('cannot connect %s, so use %s', urlDebug, url);
            return url;
        }
    });
}
//# sourceMappingURL=apiBase.js.map