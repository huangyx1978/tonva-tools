import {HttpChannel} from './httpChannel';
import {HttpChannelUI, HttpChannelNavUI} from './httpChannelUI';
import {appApi} from './appBridge';
import {ApiBase, getUrlOrDebug} from './apiBase';

let channelUIs:{[name:string]: HttpChannel} = {};
let channelNoUIs:{[name:string]: HttpChannel} = {};

export function logoutApis() {
    channelUIs = {};
    channelNoUIs = {};
    logoutUnitxApis();
}

export class Api extends ApiBase {
    apiOwner: string;
    apiName: string;
    api: string;

    constructor(basePath: string, apiOwner, apiName: string, showWaiting?: boolean) {
        super(basePath, showWaiting);
        if (apiName) {
            this.apiOwner = apiOwner;
            this.apiName = apiName;
            this.api = apiOwner + '/' + apiName;
        }
        this.showWaiting = showWaiting;
    }

    protected async getHttpChannel(): Promise<HttpChannel> {
        let channels: {[name:string]: HttpChannel};
        let channelUI: HttpChannelNavUI;
        if (this.showWaiting === true || this.showWaiting === undefined) {
            channels = channelUIs;
            channelUI = new HttpChannelNavUI();
        }
        else {
            channels = channelNoUIs;
        }
        let channel = channels[this.api];
        if (channel !== undefined) return channel;
        let apiToken = await appApi(this.api, this.apiOwner, this.apiName);
        this.token = apiToken.token;
        channel = new HttpChannel(false, apiToken.url, apiToken.token, channelUI);
        return channels[this.api] = channel;
    }
}

let channels:{[unitId:number]: HttpChannel} = {};

export function logoutUnitxApis() {
    channels = {};
}

export class UnitxApi extends Api {
    private unitId:number;
    constructor(unitId:number) {
        super('tv/', undefined, undefined, true);
        this.unitId = unitId;
    }

    protected async getHttpChannel(): Promise<HttpChannel> {
        let channel = channels[this.unitId];
        if (channel !== undefined) return channel;
        return channels[this.unitId] = await this.buildChannel();
    }

    private async buildChannel():Promise<HttpChannel> {
        let channelUI = new HttpChannelNavUI();
        let centerAppApi = new CenterAppApi('tv/', undefined);
        let ret = await centerAppApi.unitxApi(this.unitId);
        let {token, url, urlDebug} = ret;
        let realUrl = await getUrlOrDebug(url, urlDebug);
        this.token = token;
        return new HttpChannel(false, realUrl, token, channelUI);
    }
}

let centerHost:string; // = process.env.REACT_APP_CENTER_URL;

export function setCenterUrl(url:string) {
    console.log('setCenterUrl %s', url);
    centerHost = url;
    centerToken = undefined;
    centerChannel = undefined;
    centerChannelUI = undefined;
}

export function getCenterUrl():string {
    return centerHost;
}

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
    constructor(path: string, showWaiting?: boolean) {
        super(path, showWaiting);
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

export interface App {
    id: number;
    apis: AppApi[];
}

export interface AppApi {
    id: number;
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
    async apis(unit:number, appOwner:string, appName:string):Promise<App> {
        return await this.get('tie/app-apis', {unit:unit, appOwner:appOwner, appName:appName});
    }
    async unitxApi(unit:number):Promise<AppApi> {
        return await this.get('tie/unitx-api', {unit:unit});
    }
}
