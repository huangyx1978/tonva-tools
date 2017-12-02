var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { uid } from '../uid';
import { apiTokenApi } from './centerApi';
const apiTokens = {};
const appsInFrame = {};
let appHash;
window.addEventListener('message', function (evt) {
    return __awaiter(this, void 0, void 0, function* () {
        let e = evt;
        var message = e.data;
        switch (message.type) {
            default: break;
            case 'app-api':
                console.log("receive PostMessage: %s", JSON.stringify(message));
                let ret = yield onReceiveAppApiMessage(message.hash);
                e.source.postMessage({ type: 'app-api-return', url: ret.url, token: ret.token }, "*");
                break;
            case 'app-api-return':
                console.log("app-api-return: %s", JSON.stringify(message));
                break;
        }
    });
});
function onReceiveAppApiMessage(hash) {
    return __awaiter(this, void 0, void 0, function* () {
        return { url: 'ddd', token: 'ttt' };
    });
}
let parent = window.parent;
if (parent !== undefined) {
    //console.log("postMessage: %s", window.location.origin);
    parent.postMessage({ type: 'app-api', url: window.location.href }, "*");
}
export function setAppHash(hash) {
    appHash = hash;
}
export function appUrl(url, unitId, appId) {
    let u;
    for (;;) {
        u = uid();
        let a = appsInFrame[u];
        if (a === undefined) {
            appsInFrame[u] = { unit: unitId, app: appId };
            break;
        }
    }
    return url + '#tv' + u;
}
export function appApi(apiName) {
    return __awaiter(this, void 0, void 0, function* () {
        let apiToken = apiTokens[apiName];
        if (apiToken !== undefined)
            return apiToken;
        if (window === window.parent) {
            apiToken = yield apiTokenApi.api({ dd: 'd' });
            apiTokens[apiName] = apiToken;
            return apiToken;
        }
        console.log("appApi parent send: %s", appHash);
        apiToken = {
            url: undefined,
            token: undefined,
            resolve: undefined,
            reject: undefined,
        };
        apiTokens[apiName] = apiToken;
        return new Promise((resolve, reject) => {
            apiToken.resolve = (at) => __awaiter(this, void 0, void 0, function* () {
                let a = yield at;
                console.log('return from parent window: %s', JSON.stringify(a));
                apiToken.url = a.url;
                apiToken.token = a.token;
                resolve(apiToken);
            });
            apiToken.reject = reject;
            window.parent.postMessage({
                type: 'app-api',
                hash: appHash,
            }, "*");
        });
        //apiToken = await apiTokenApi.api({dd: 'd'});
        //return apiToken;
    });
}
//# sourceMappingURL=app.js.map