import {ApiBase} from './apiBase';
import {HttpChannel} from './httpChannel';
import {HttpChannelUI, HttpChannelNavUI} from './httpChannelUI';
import {appApi} from './appBridge';

const channelUIs:{[name:string]: HttpChannel} = {};
const channelNoUIs:{[name:string]: HttpChannel} = {};

export class Api extends ApiBase {
    private apiName: string;

    constructor(path: string, apiName: string, showWaiting?: boolean) {
        super(path, showWaiting);
        this.apiName = apiName? apiName : undefined;
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
        let channel = channels[this.apiName];
        if (channel !== undefined) return channel;
        
        // await center Channel get api
        let apiToken = await appApi(this.apiName);
        channel = new HttpChannel(false, apiToken.url, apiToken.token, channelUI);
        return channels[this.apiName] = channel;
    }
}
