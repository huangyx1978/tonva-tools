import {nav} from '../ui';
import {uid} from '../uid';
import {apiTokenApi, callCenterapi, CenterAppApi, AppApi} from './centerApi';

const debugUnitId = Number(process.env.REACT_APP_DEBUG_UNITID);

export interface ApiToken {
    name: string;
    url: string;
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
}
const appsInFrame:{[key:string]:AppInFrame} = {};

export let meInFrame:AppInFrame = {
    hash: undefined,
    unit: debugUnitId,
}

export function isBridged():boolean {
    return window.opener !== undefined || self !== window.parent;
    //if (sourceWin === undefined && window === window.parent) {
}

window.addEventListener('message', async function(evt) {
    let e:any = evt;
    var message = e.data;
    switch (message.type) {
        default: break;
        case 'hide-frame-back':
            hideFrameBack(message.hash);
            break;
        case 'pop-app':
            nav.navBack();
            break;
        case 'center-api':
            await callCenterApiFromMessage(e.source, message);
            break;
        case 'center-api-return':
            bridgeCenterApiReturn(message);
            break;
        case 'app-api':
            console.log("receive PostMessage: %s", JSON.stringify(message));
            let ret = await onReceiveAppApiMessage(message.hash, message.apiName);
            console.log("onReceiveAppApiMessage: %s", JSON.stringify(ret));
            e.source.postMessage({
                type: 'app-api-return', 
                apiName: message.apiName,
                url: ret.url,
                token: ret.token}, "*");
            break;
        case 'app-api-return':
            console.log("app-api-return: %s", JSON.stringify(message));
            onAppApiReturn(message.apiName, message.url, message.token);
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
    if (appInFrame === undefined) return {name:apiName, url:undefined, token:undefined};
    let {unit} = appInFrame;
    let parts = apiName.split('/');
    let ret = await apiTokenApi.api({unit: unit, apiOwner: parts[0], apiName: parts[1]});
    if (ret === undefined) {
        console.log('apiTokenApi.api return undefined. api=%s, unit=%s', apiName, unit);
        throw 'api not found';
    }
    return {name: apiName, url: ret.url, token: ret.token};
}

function onAppApiReturn(api: string, url: string, token: string) {
    let action = apiTokens[api];
    if (action === undefined) {
        throw 'error app api return';
        //return;
    }
    action.url = url;
    action.token = token;
    action.resolve(action);
}

export function setMeInFrame(appHash: string):AppInFrame {
    let p0 = 3;
    let p1 = appHash.indexOf('-', p0);
    if (p1<p0) return;
    //let p2 = appHash.indexOf('-', p1+1);
    //if (p2<p1) return;
    meInFrame.hash = appHash.substring(p0, p1);
    meInFrame.unit = Number(appHash.substring(p1+1));
    //meInFrame.app = Number(appHash.substring(p2+1));
    return meInFrame;
}

export function appUrl(url: string, unitId: number):{url:string; hash:string} {
    let u:string;
    for (;;) {
        u = uid();
        let a = appsInFrame[u];
        if (a === undefined) {
            appsInFrame[u] = {hash:u, unit:unitId};
            break;
        }
    }
    return {url: url + '#tv' + u + '-' + unitId, hash: u};
}

export async function loadAppApis(appOwner:string, appName): Promise<AppApi[]> {
    let centerAppApi = new CenterAppApi('tv/');
    return await centerAppApi.apis(debugUnitId, appOwner, appName);
}

export async function appApi(api:string, apiOwner:string, apiName:string): Promise<ApiToken> {
    let apiToken = apiTokens[api];
    if (apiToken !== undefined) return apiToken;
    if (!isBridged()) {
        apiToken = await apiTokenApi.api({unit: debugUnitId, apiOwner:apiOwner, apiName:apiName});
        apiTokens[api] = apiToken;
        if (apiToken === undefined) {
            let err = 'unauthorized call: apiTokenApi center return undefined!';
            //console.log(err);
            throw err;
        }
        return apiToken;
    }
    console.log("appApi parent send: %s", meInFrame.hash);
    apiToken = {
        name: api,
        url: undefined,
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
    //apiToken = await apiTokenApi.api({dd: 'd'});
    //return apiToken;
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
