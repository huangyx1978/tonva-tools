var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { isDevelopment } from '../local';
import { centerDebugHost, usqDebugHost, debugUsqlServer } from './debugHost';
import { fetchLocalCheck } from './fetchLocalCheck';
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
    get(path, params = undefined) {
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
function replaceUrlHost(url, hostString, defaultHost, envHost) {
    //let hostString = '://centerhost:';
    let pos = url.indexOf(hostString);
    if (pos > 0) {
        let host = process.env[envHost] || defaultHost;
        url = url.replace(hostString, '://' + host + '/');
    }
    return url;
}
export function getUrlOrDebug(url, urlDebug, path = 'hello') {
    return __awaiter(this, void 0, void 0, function* () {
        if (isDevelopment !== true)
            return url;
        if (!urlDebug)
            return url;
        try {
            let orgDebug = urlDebug;
            if (urlDebug.endsWith('/') === false)
                urlDebug += '/';
            urlDebug = replaceUrlHost(urlDebug, '://centerhost/', centerDebugHost, 'REACT_APP_CENTER_DEBUG_HOST');
            urlDebug = replaceUrlHost(urlDebug, '://usqhost/', usqDebugHost, 'REACT_APP_USQ_DEBUG_HOST');
            urlDebug = replaceUrlHost(urlDebug, '://unitxhost/', usqDebugHost, 'REACT_APP_USQ_DEBUG_HOST');
            urlDebug = replaceUrlHost(urlDebug, '://usql-server/', debugUsqlServer, 'REACT_APP_DEBUG_USQL_SERVER');
            if (path === undefined)
                path = '';
            let fetchUrl = urlDebug + path;
            console.log('urlDebug: ' + orgDebug + ' ---- ' + urlDebug + ' === ' + fetchUrl);
            let fetchOptions = {
                method: "GET",
                mode: "no-cors",
                headers: {
                    "Content-Type": "text/plain"
                },
            };
            let ret = yield fetchLocalCheck(fetchUrl, fetchOptions);
            let text = yield ret.text();
            return urlDebug;
        }
        catch (error) {
            console.log('cannot connect %s, so use %s', urlDebug, url);
            console.error(error);
            return url;
        }
    });
}
//# sourceMappingURL=apiBase.js.map