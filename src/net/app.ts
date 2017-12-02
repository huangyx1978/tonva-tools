import {uid} from '../uid';
import {apiTokenApi} from './centerApi';

export interface ApiToken {
    url: string;
    token: string;
}
interface ApiTokenAction extends ApiToken {
    resolve: (value?: ApiToken | PromiseLike<ApiToken>) => void;
    reject: (reason?: any) => void;
}
const apiTokens:{[apiName:string]: ApiTokenAction}  = {};

interface AppInFrame {
    unit: number;   // unit id
    app: number;    // app id
}
const appsInFrame:{[key:string]:AppInFrame} = {};

let appHash:string;

window.addEventListener('message', async function(evt) {
    let e:any = evt;
    var message = e.data;
    switch (message.type) {
        default: break;
        case 'app-api':
            console.log("receive PostMessage: %s", JSON.stringify(message));
            let ret = await onReceiveAppApiMessage(message.hash);
            e.source.postMessage({type: 'app-api-return', url: ret.url, token: ret.token}, "*");
            break;
        case 'app-api-return':
            console.log("app-api-return: %s", JSON.stringify(message));
            break;
    }
});

async function onReceiveAppApiMessage(hash: string): Promise<ApiToken> {
    return {url: 'ddd', token: 'ttt'};
}

let parent = window.parent;
if (parent !== undefined) {
    //console.log("postMessage: %s", window.location.origin);
    parent.postMessage({type: 'app-api', url: window.location.href}, "*");
}

export function setAppHash(hash: string) {
    appHash = hash;
}

export function appUrl(url: string, unitId: number, appId: number) {
    let u:string;
    for (;;) {
        u = uid();
        let a = appsInFrame[u];
        if (a === undefined) {
            appsInFrame[u] = {unit:unitId, app:appId};
            break;
        }
    }
    return url + '#tv' + u;
}

export async function appApi(apiName: string): Promise<ApiToken> {
    let apiToken = apiTokens[apiName];
    if (apiToken !== undefined) return apiToken;
    if (window === window.parent) {
        apiToken = await apiTokenApi.api({dd: 'd'});
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
    return new Promise<ApiToken>((resolve, reject) => {
        apiToken.resolve = async (at) => {
            let a = await at;
            console.log('return from parent window: %s', JSON.stringify(a));
            apiToken.url = a.url;
            apiToken.token = a.token;
            resolve(apiToken);
        }
        apiToken.reject = reject;
        window.parent.postMessage({
            type: 'app-api',
            hash: appHash,
        }, "*");
    });
    //apiToken = await apiTokenApi.api({dd: 'd'});
    //return apiToken;
}
