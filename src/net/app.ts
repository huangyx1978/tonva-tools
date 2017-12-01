import {uid} from '../uid';

interface AppInFrame {
    unit: number;   // unit id
    app: number;    // app id
}
const appsInFrame:{[key:string]:AppInFrame} = {};

let appHash:string;

window.addEventListener('message', function(evt) {
    let e:any = evt;
    var message = e.data;
    switch (message.type) {
        default: break;
        case 'app-api':
            console.log("receive PostMessage: %s", JSON.stringify(message));
            e.source.postMessage({type: 'app-api-return', url: window.location.href}, "*");
            break;
        case 'app-api-return':
            console.log("app-api-return: %s", JSON.stringify(message));
            break;
    }
});

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

export async function appApi(apiName: string): Promise<{url:string, token:string}> {
    return;
}
