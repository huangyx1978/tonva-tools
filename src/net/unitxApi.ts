import {ApiBase, getUrlOrDebug} from './apiBase';
import {HttpChannel} from './httpChannel';
import {HttpChannelNavUI} from './httpChannelUI';
import {CenterAppApi} from './centerApi';

let channels:{[unitId:number]: HttpChannel} = {};

export function logoutUnitxApis() {
    channels = {};
}

export class UnitxApi extends ApiBase {
    private unitId:number;
    constructor(unitId:number) {
        super('tv/', true);
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
