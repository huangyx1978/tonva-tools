import {ApiBase} from './apiBase';
import {HttpChannel} from './httpChannel';
import {HttpChannelUI, HttpChannelNavUI} from './httpChannelUI';
import {appApi} from './appBridge';
import {CenterAppApi} from './centerApi';

let channels:{[unitId:number]: HttpChannel} = {};

export function logoutChatApis() {
    channels = {};
}

export class ChatApi extends ApiBase {
    private unitId:number;
    /*
    url: string;
    apiOwner: string;
    apiName: string;
    api: string;
    */

    constructor(unitId:number) {
    //constructor(path: string, url:string, apiOwner, apiName: string, showWaiting?: boolean) {
        super('tv/', undefined, true);
        this.unitId = unitId;
        /*
        this.url = url;
        if (apiName) {
            this.apiOwner = apiOwner;
            this.apiName = apiName;
            this.api = apiOwner + '/' + apiName;
        }
        this.showWaiting = showWaiting;
        */
    }

    protected async getHttpChannel(): Promise<HttpChannel> {
        let channel = channels[this.unitId];
        if (channel !== undefined) return channel;
        return channels[this.unitId] = await this.buildChannel();
    }

    private async buildChannel():Promise<HttpChannel> {
        let channelUI = new HttpChannelNavUI();
        let centerAppApi = new CenterAppApi('tv/', undefined);
        let ret = await centerAppApi.chatApi(this.unitId);
        let {token, url, urlDebug, ws, wsDebug} = ret;
        if (process.env.NODE_ENV==='development') {
            if (urlDebug !== undefined) url = urlDebug;
            if (wsDebug !== undefined) ws = wsDebug;
        }
        this.ws = ws;
        this.token = token;
        return new HttpChannel(false, url, token, channelUI);
    }
}
