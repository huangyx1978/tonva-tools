import _ from 'lodash';
import {nav} from '../ui';
import {uid} from '../uid';
import {usqTokenApi, callCenterapi, CenterAppApi, AppUsq, centerToken, App} from './usqApi';
import {setSubAppWindow, wsBridge} from './wsChannel';
import { getUrlOrDebug } from './apiBase';

export interface UsqToken {
    name: string;
    url: string;
    urlDebug: string;
    token: string;
}
interface UsqTokenAction extends UsqToken {
    resolve: (value?: UsqToken | PromiseLike<UsqToken>) => void;
    reject: (reason?: any) => void;
}
const usqTokens:{[usqName:string]: UsqTokenAction}  = {};
export function logoutUsqTokens() {
    for (let i in usqTokens) usqTokens[i] = undefined;
}

export interface AppInFrame {
    hash: string;
    unit: number;       // unit id
    page?: string;
    param?: string[];
}
const appsInFrame:{[key:string]:AppInFrame} = {};

class AppInFrameClass implements AppInFrame {
    hash: string;
    private _unit: number;
    get unit(): number {return this._unit;}       // unit id
    set unit(val:number) { this._unit=val;}
    page?: string;
    param?: string[];
}

export let meInFrame:AppInFrame = new AppInFrameClass();
/* {
    hash: undefined,
    get unit():number {return } undefined, //debugUnitId,
    page: undefined;
    param: undefined,
}*/

export function isBridged():boolean {
    return self !== window.parent;
}

window.addEventListener('message', async function(evt) {
    var message = evt.data;
    switch (message.type) {
        case 'sub-frame-started':
            subFrameStarted(evt);
            break;
        case 'ws':
            //wsBridge.receive(message.msg);
            await nav.onReceive(message.msg);
            break;
        case 'init-sub-win':
            await initSubWin(message);
            break;
        case 'pop-app':
            nav.navBack();
            break;
        case 'center-api':
            await callCenterApiFromMessage(evt.source as Window, message);
            break;
        case 'center-api-return':
            bridgeCenterApiReturn(message);
            break;
        case 'app-api':
            console.log("receive PostMessage: %s", JSON.stringify(message));
            let ret = await onReceiveAppApiMessage(message.hash, message.apiName);
            console.log("onReceiveAppApiMessage: %s", JSON.stringify(ret));
            (evt.source as Window).postMessage({
                type: 'app-api-return', 
                apiName: message.apiName,
                url: ret.url,
                urlDebug: ret.urlDebug,
                token: ret.token} as any, "*");
            break;
        case 'app-api-return':
            console.log("app-api-return: %s", JSON.stringify(message));
            console.log('await onAppApiReturn(message);');
            await onAppApiReturn(message);
            break;
        default:
            this.console.log('message: %s', JSON.stringify(message));
            break;
    }
});

function subFrameStarted(evt:any) {
    var message = evt.data;
    let subWin = evt.source as Window;
    setSubAppWindow(subWin);
    hideFrameBack(message.hash);
    let msg:any = _.clone(nav.user);
    msg.type = 'init-sub-win';
    subWin.postMessage(msg, '*');
}
function hideFrameBack(hash:string) {
    let el = document.getElementById(hash);
    if (el !== undefined) el.hidden = true;
}
async function initSubWin(message:any) {
    console.log('initSubWin: set nav.user', message);
    nav.user = message; // message.user;
    await nav.showAppView();
}
async function onReceiveAppApiMessage(hash: string, apiName: string): Promise<UsqToken> {
    let appInFrame = appsInFrame[hash];
    if (appInFrame === undefined) return {name:apiName, url:undefined, urlDebug:undefined, token:undefined};
    let {unit} = appInFrame;
    let parts = apiName.split('/');
    let ret = await usqTokenApi.usq({unit: unit, usqOwner: parts[0], usqName: parts[1]});
    if (ret === undefined) {
        console.log('apiTokenApi.api return undefined. api=%s, unit=%s', apiName, unit);
        throw 'api not found';
    }
    return {name: apiName, url: ret.url, urlDebug:ret.urlDebug, token: ret.token};
}

async function onAppApiReturn(message:any) {
    let {apiName, url, urlDebug, token} = message;
    let action = usqTokens[apiName];
    if (action === undefined) {
        throw 'error app api return';
        //return;
    }
    let realUrl = await getUrlOrDebug(url, urlDebug);
    console.log('onAppApiReturn(message:any): url=' + url + ', debug=' + urlDebug + ', real=' + realUrl);
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

export async function loadAppUsqs(appOwner:string, appName): Promise<App> {
    let centerAppApi = new CenterAppApi('tv/', undefined);
    let unit = meInFrame.unit;
    return await centerAppApi.usqs(unit, appOwner, appName);
}

export async function appUsq(usq:string, usqOwner:string, usqName:string): Promise<UsqToken> {
    let usqToken = usqTokens[usq];
    if (usqToken !== undefined) return usqToken;
    if (!isBridged()) {
        usqToken = await usqTokenApi.usq({unit: meInFrame.unit, usqOwner:usqOwner, usqName:usqName});
        if (usqToken === undefined) {
            let err = 'unauthorized call: usqTokenApi center return undefined!';
            throw err;
        }
        if (usqToken.token === undefined) usqToken.token = centerToken;
        let {url, urlDebug} = usqToken;
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
    return new Promise<UsqToken>((resolve, reject) => {
        usqToken.resolve = async (at) => {
            let a = await at;
            console.log('return from parent window: %s', JSON.stringify(a));
            usqToken.url = a.url;
            usqToken.urlDebug = a.urlDebug;
            usqToken.token = a.token;
            resolve(usqToken);
        }
        usqToken.reject = reject;
        (window.opener || window.parent).postMessage({
            type: 'app-api',
            apiName: usq,
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
export async function bridgeCenterApi(url:string, method:string, body:any):Promise<any> {
    console.log('bridgeCenterApi: url=%s, method=%s', url, method);
    return await new Promise<any>(async (resolve, reject) => {
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
