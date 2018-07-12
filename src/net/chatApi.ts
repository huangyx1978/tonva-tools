import {ApiBase, getUrlOrDebug} from './apiBase';
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
    constructor(unitId:number) {
        super('tv/', /*undefined, */true);
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
        let ret = await centerAppApi.chatApi(this.unitId);
        let {token, url, urlDebug/*, ws, wsDebug*/} = ret;
        let realUrl = await getUrlOrDebug(url, urlDebug);
        this.token = token;
        return new HttpChannel(false, realUrl, token, channelUI);
    }
}
