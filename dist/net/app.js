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
const uid_1 = require("../uid");
const appsInFrame = {};
let appHash;
window.addEventListener('message', function (evt) {
    let e = evt;
    var message = e.data;
    switch (message.type) {
        default: break;
        case 'app-api':
            console.log("receive PostMessage: %s", JSON.stringify(message));
            e.source.postMessage({ type: 'app-api-return', url: window.location.href }, "*");
            break;
        case 'app-api-return':
            console.log("app-api-return: %s", JSON.stringify(message));
            break;
    }
});
let parent = window.parent;
if (parent !== undefined) {
    //console.log("postMessage: %s", window.location.origin);
    parent.postMessage({ type: 'app-api', url: window.location.href }, "*");
}
function setAppHash(hash) {
    appHash = hash;
}
exports.setAppHash = setAppHash;
function appUrl(url, unitId, appId) {
    let u;
    for (;;) {
        u = uid_1.uid();
        let a = appsInFrame[u];
        if (a === undefined) {
            appsInFrame[u] = { unit: unitId, app: appId };
            break;
        }
    }
    return url + '#tv' + u;
}
exports.appUrl = appUrl;
function appApi(apiName) {
    return __awaiter(this, void 0, void 0, function* () {
        return;
    });
}
exports.appApi = appApi;
//# sourceMappingURL=app.js.map