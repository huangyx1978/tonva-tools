import {FetchError} from '../fetchError';
import {HttpChannelNavUI} from './httpChannelUI';
import {HttpChannel} from './httpChannel';
import {ApiBase} from './apiBase';

const centerHost = process.env.REACT_APP_CENTER_URL; //APIHOST_CENTER;
export let centerToken:string|undefined = undefined;

export function setCenterToken(t?:string) {
    centerToken = t;
    console.log('setCenterToken %s', t);
    centerChannel = undefined;
    centerChannelUI = undefined;
}

let centerChannelUI:HttpChannel;
let centerChannel:HttpChannel;
function getCenterChannelUI():HttpChannel {
    if (centerChannelUI !== undefined) return centerChannelUI;
    return centerChannelUI = new HttpChannel(true, centerHost, centerToken, new HttpChannelNavUI());
}
function getCenterChannel():HttpChannel {
    if (centerChannel !== undefined) return centerChannel;
    return centerChannel = new HttpChannel(true, centerHost, centerToken);
}

export abstract class CenterApi extends ApiBase {
    //private channel: HttpChannel;

    constructor(path: string, ws:string, showWaiting?: boolean) {
        super(path, ws, showWaiting);
    }

    protected async getHttpChannel(): Promise<HttpChannel> {
        return (this.showWaiting === true || this.showWaiting === undefined)?
            getCenterChannelUI():
            getCenterChannel();
    }
}

export class ApiTokenApi extends CenterApi {
    async api(params: {unit:number, apiOwner:string, apiName:string}):Promise<any> {
        return await this.get('app-api', params);
    }
}

export const apiTokenApi = new ApiTokenApi('tv/tie/', undefined);


export class CallCenterApi extends CenterApi {
    directCall(url:string, method:string, body:any):Promise<any> {
        return this.call(url, method, body);
    }
}
export const callCenterapi = new CallCenterApi('', undefined);

export interface AppApi {
    apiOwner: string;
    apiName: string;
    url: string;
    urlDebug: string;
    ws: string;
    wsDebug: string;
    access: string;
    token: string;
}
console.log('CenterApi');
console.log(CenterApi);
export class CenterAppApi extends CenterApi {
    async apis(unit:number, appOwner:string, appName:string):Promise<AppApi[]> {
        return await this.get('tie/app-apis', {unit:unit, appOwner:appOwner, appName:appName});
    }
    async chatApi(unit:number):Promise<AppApi> {
        return await this.get('tie/chat-api', {unit:unit});
    }
}
