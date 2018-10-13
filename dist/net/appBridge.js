import { nav } from '../ui';
import { uid } from '../uid';
import { usqTokenApi, callCenterapi, CenterAppApi, centerToken } from './usqApi';
import { setSubAppWindow, wsBridge } from './wsChannel';
import { getUrlOrDebug } from './apiBase';
const usqTokens = {};
const appsInFrame = {};
class AppInFrameClass {
    get unit() { return this._unit; } // unit id
    set unit(val) { this._unit = val; }
}
export let meInFrame = new AppInFrameClass();
/* {
    hash: undefined,
    get unit():number {return } undefined, //debugUnitId,
    page: undefined;
    param: undefined,
}*/
export function isBridged() {
    return self !== window.parent;
}
window.addEventListener('message', async function (evt) {
    var message = evt.data;
    switch (message.type) {
        default:
            this.console.log('message: %s', JSON.stringify(message));
            break;
        case 'ws':
            wsBridge.receive(message.msg);
            break;
        case 'hide-frame-back':
            setSubAppWindow(evt.source);
            hideFrameBack(message.hash);
            break;
        case 'pop-app':
            nav.navBack();
            break;
        case 'center-api':
            await callCenterApiFromMessage(evt.source, message);
            break;
        case 'center-api-return':
            bridgeCenterApiReturn(message);
            break;
        case 'app-api':
            console.log("receive PostMessage: %s", JSON.stringify(message));
            let ret = await onReceiveAppApiMessage(message.hash, message.apiName);
            console.log("onReceiveAppApiMessage: %s", JSON.stringify(ret));
            evt.source.postMessage({
                type: 'app-api-return',
                apiName: message.apiName,
                url: ret.url,
                urlDebug: ret.urlDebug,
                token: ret.token
            }, "*");
            break;
        case 'app-api-return':
            console.log("app-api-return: %s", JSON.stringify(message));
            console.log('await onAppApiReturn(message);');
            await onAppApiReturn(message);
            break;
    }
});
function hideFrameBack(hash) {
    console.log('hideFrameBack %s', hash);
    let el = document.getElementById(hash);
    if (el !== undefined)
        el.hidden = true;
}
async function onReceiveAppApiMessage(hash, apiName) {
    let appInFrame = appsInFrame[hash];
    if (appInFrame === undefined)
        return { name: apiName, url: undefined, urlDebug: undefined, token: undefined };
    let { unit } = appInFrame;
    let parts = apiName.split('/');
    let ret = await usqTokenApi.usq({ unit: unit, usqOwner: parts[0], usqName: parts[1] });
    if (ret === undefined) {
        console.log('apiTokenApi.api return undefined. api=%s, unit=%s', apiName, unit);
        throw 'api not found';
    }
    return { name: apiName, url: ret.url, urlDebug: ret.urlDebug, token: ret.token };
}
async function onAppApiReturn(message) {
    console.log('start await onAppApiReturn(message);');
    let { apiName, url, urlDebug, token } = message;
    let action = usqTokens[apiName];
    if (action === undefined) {
        throw 'error app api return';
        //return;
    }
    console.log('async function onAppApiReturn(message:any) {');
    let realUrl = await getUrlOrDebug(url, urlDebug);
    action.url = realUrl;
    action.token = token;
    action.resolve(action);
}
export function setMeInFrame(appHash) {
    let parts = appHash.split('-');
    let len = parts.length;
    meInFrame.hash = parts[0].substr(3);
    if (len > 0)
        meInFrame.unit = Number(parts[1]);
    if (len > 1)
        meInFrame.page = parts[2];
    if (len > 2)
        meInFrame.param = parts.slice(3);
    return meInFrame;
}
export function appUrl(url, unitId, page, param) {
    let u;
    for (;;) {
        u = uid();
        let a = appsInFrame[u];
        if (a === undefined) {
            appsInFrame[u] = { hash: u, unit: unitId };
            break;
        }
    }
    url += '#tv' + u + '-' + unitId;
    if (page !== undefined) {
        url += '-' + page;
        if (param !== undefined) {
            for (let i = 0; i < param.length; i++) {
                url += '-' + param[i];
            }
        }
    }
    return { url: url, hash: u };
}
export async function loadAppUsqs(appOwner, appName) {
    let centerAppApi = new CenterAppApi('tv/', undefined);
    let unit = meInFrame.unit;
    return await centerAppApi.usqs(unit, appOwner, appName);
}
export async function appUsq(usq, usqOwner, usqName) {
    let usqToken = usqTokens[usq];
    if (usqToken !== undefined)
        return usqToken;
    if (!isBridged()) {
        usqToken = await usqTokenApi.usq({ unit: meInFrame.unit, usqOwner: usqOwner, usqName: usqName });
        if (usqToken === undefined) {
            let err = 'unauthorized call: usqTokenApi center return undefined!';
            throw err;
        }
        if (usqToken.token === undefined)
            usqToken.token = centerToken;
        let { url, urlDebug } = usqToken;
        let realUrl = await getUrlOrDebug(url, urlDebug);
        console.log('realUrl: %s', realUrl);
        usqToken.url = realUrl;
        usqTokens[usq] = usqToken;
        return usqToken;
    }
    console.log("appApi parent send: %s", meInFrame.hash);
    usqToken = {
        name: usq,
        url: undefined,
        urlDebug: undefined,
        token: undefined,
        resolve: undefined,
        reject: undefined,
    };
    usqTokens[usq] = usqToken;
    return new Promise((resolve, reject) => {
        usqToken.resolve = async (at) => {
            let a = await at;
            console.log('return from parent window: %s', JSON.stringify(a));
            usqToken.url = a.url;
            usqToken.urlDebug = a.urlDebug;
            usqToken.token = a.token;
            resolve(usqToken);
        };
        usqToken.reject = reject;
        (window.opener || window.parent).postMessage({
            type: 'app-api',
            apiName: usq,
            hash: meInFrame.hash,
        }, "*");
    });
}
const brideCenterApis = {};
export function bridgeCenterApi(url, method, body) {
    console.log('bridgeCenterApi: url=%s, method=%s', url, method);
    return new Promise(async (resolve, reject) => {
        let callId;
        for (;;) {
            callId = uid();
            let bca = brideCenterApis[callId];
            if (bca === undefined) {
                brideCenterApis[callId] = {
                    id: callId,
                    resolve: resolve,
                    reject: reject,
                };
                break;
            }
        }
        (window.opener || window.parent).postMessage({
            type: 'center-api',
            callId: callId,
            url: url,
            method: method,
            body: body
        }, '*');
    });
}
async function callCenterApiFromMessage(from, message) {
    let { callId, url, method, body } = message;
    let result = await callCenterapi.directCall(url, method, body);
    from.postMessage({
        type: 'center-api-return',
        callId: callId,
        result: result,
    }, '*');
}
function bridgeCenterApiReturn(message) {
    let { callId, result } = message;
    let bca = brideCenterApis[callId];
    if (bca === undefined)
        return;
    brideCenterApis[callId] = undefined;
    bca.resolve(result);
}
//# sourceMappingURL=appBridge.js.map