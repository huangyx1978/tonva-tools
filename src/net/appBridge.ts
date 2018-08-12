import {nav} from '../ui';
import {uid} from '../uid';
import {apiTokenApi, callCenterapi, CenterAppApi, AppApi, centerToken, App} from './api';
import {setSubAppWindow, wsBridge} from './wsChannel';
import { getUrlOrDebug } from './apiBase';

//const debugUnitId = Number(process.env.REACT_APP_DEBUG_UNITID);

export interface ApiToken {
    name: string;
    url: string;
    urlDebug: string;
    token: string;
}
interface ApiTokenAction extends ApiToken {
    resolve: (value?: ApiToken | PromiseLike<ApiToken>) => void;
    reject: (reason?: any) => void;
}
const apiTokens:{[apiName:string]: ApiTokenAction}  = {};

export interface AppInFrame {
    hash: string;
    unit: number;       // unit id
    page?: string;
    param?: string[];
}
const appsInFrame:{[key:string]:AppInFrame} = {};

export let meInFrame:AppInFrame = {
    hash: undefined,
    unit: undefined, //debugUnitId,
    page: undefined,
    param: undefined,
}

export function isBridged():boolean {
    return self !== window.parent;
}

window.addEventListener('message', async function(evt) {
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
                token: ret.token}, "*");
            break;
        case 'app-api-return':
            console.log("app-api-return: %s", JSON.stringify(message));
            await onAppApiReturn(message);
            break;
    }
});

function hideFrameBack(hash:string) {
    console.log('hideFrameBack %s', hash);
    let el = document.getElementById(hash);
    if (el !== undefined) el.hidden = true;
}

async function onReceiveAppApiMessage(hash: string, apiName: string): Promise<ApiToken> {
    let appInFrame = appsInFrame[hash];
    if (appInFrame === undefined) return {name:apiName, url:undefined, urlDebug:undefined, token:undefined};
    let {unit} = appInFrame;
    let parts = apiName.split('/');
    let ret = await apiTokenApi.api({unit: unit, apiOwner: parts[0], apiName: parts[1]});
    if (ret === undefined) {
        console.log('apiTokenApi.api return undefined. api=%s, unit=%s', apiName, unit);
        throw 'api not found';
    }
    return {name: apiName, url: ret.url, urlDebug:ret.urlDebug, token: ret.token};
}

async function onAppApiReturn(message:any) {
    let {apiName, url, urlDebug, token} = message;
    let action = apiTokens[apiName];
    if (action === undefined) {
        throw 'error app api return';
        //return;
    }
    let realUrl = await getUrlOrDebug(url, urlDebug);
    action.url = realUrl;
    action.token = token;
    action.resolve(action);
}

export function setMeInFrame(appHash: string):AppInFrame {
    let parts = appHash.split('-');
    let len = parts.length;
    meInFrame.hash = parts[0].substr(3);
    if (len>0) meInFrame.unit = Number(parts[1]);
    if (len>1) meInFrame.page = parts[2];
    if (len>2) meInFrame.param = parts.slice(3);
    return meInFrame;
}

export function appUrl(url: string, unitId: number, page?:string, param?:any[]):{url:string; hash:string} {
    let u:string;
    for (;;) {
        u = uid();
        let a = appsInFrame[u];
        if (a === undefined) {
            appsInFrame[u] = {hash:u, unit:unitId};
            break;
        }
    }
    url += '#tv' + u + '-' + unitId;
    if (page !== undefined) {
        url += '-' + page;
        if (param !== undefined) {
            for (let i=0; i<param.length; i++) {
                url += '-' + param[i];
            }
        }
    }
    return {url: url, hash: u};
}

export async function loadAppApis(appOwner:string, appName): Promise<App> {
    let centerAppApi = new CenterAppApi('tv/', undefined);
    return await centerAppApi.apis(meInFrame.unit, appOwner, appName);
}

export async function appApi(api:string, apiOwner:string, apiName:string): Promise<ApiToken> {
    let apiToken = apiTokens[api];
    if (apiToken !== undefined) return apiToken;
    if (!isBridged()) {
        apiToken = await apiTokenApi.api({unit: meInFrame.unit, apiOwner:apiOwner, apiName:apiName});
        if (apiToken === undefined) {
            let err = 'unauthorized call: apiTokenApi center return undefined!';
            throw err;
        }
        if (apiToken.token === undefined) apiToken.token = centerToken;
        let {url, urlDebug} = apiToken;
        let realUrl = await getUrlOrDebug(url, urlDebug);
        console.log('realUrl: %s', realUrl);
        apiToken.url = realUrl;
        apiTokens[api] = apiToken;
        return apiToken;
    }
    console.log("appApi parent send: %s", meInFrame.hash);
    apiToken = {
        name: api,
        url: undefined,
        urlDebug: undefined,
        token: undefined,
        resolve: undefined,
        reject: undefined,
    };
    apiTokens[api] = apiToken;
    return new Promise<ApiToken>((resolve, reject) => {
        apiToken.resolve = async (at) => {
            let a = await at;
            console.log('return from parent window: %s', JSON.stringify(a));
            apiToken.url = a.url;
            apiToken.urlDebug = a.urlDebug;
            apiToken.token = a.token;
            resolve(apiToken);
        }
        apiToken.reject = reject;
        (window.opener || window.parent).postMessage({
            type: 'app-api',
            apiName: api,
            hash: meInFrame.hash,
        }, "*");
    });
}

interface BridgeCenterApi {
    id: string;
    resolve: (value?:any)=>any;
    reject: (reason?:any)=>void;
}
const brideCenterApis:{[id:string]: BridgeCenterApi} = {};
export function bridgeCenterApi(url:string, method:string, body:any):Promise<any> {
    console.log('bridgeCenterApi: url=%s, method=%s', url, method);
    return new Promise<any>(async (resolve, reject) => {
        let callId:string;
        for (;;) {
            callId = uid();
            let bca = brideCenterApis[callId];
            if (bca === undefined) {
                brideCenterApis[callId] = {
                    id: callId,
                    resolve: resolve,
                    reject: reject,
                }
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

async function callCenterApiFromMessage(from:Window, message):Promise<void> {
    let {callId, url, method, body} = message;
    let result = await callCenterapi.directCall(url, method, body);
    from.postMessage({
        type: 'center-api-return',
        callId: callId,
        result: result,
    }, '*');
}

function bridgeCenterApiReturn(message:any) {
    let {callId, result} = message;
    let bca = brideCenterApis[callId];
    if (bca === undefined) return;
    brideCenterApis[callId] = undefined;
    bca.resolve(result);
}
