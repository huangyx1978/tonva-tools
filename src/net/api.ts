import {ApiBase} from './apiBase';
import {HttpChannel} from './httpChannel';
import {HttpChannelUI, HttpChannelNavUI} from './httpChannelUI';
import {appApi} from './appBridge';

let channelUIs:{[name:string]: HttpChannel} = {};
let channelNoUIs:{[name:string]: HttpChannel} = {};

export function logoutApis() {
    channelUIs = {};
    channelNoUIs = {};
}

export class Api extends ApiBase {
    apiOwner: string;
    apiName: string;
    api: string;

    constructor(path: string, apiOwner, apiName: string, showWaiting?: boolean) {
        super(path, showWaiting);
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
        
        // await center Channel get api
        let owner = this.apiOwner;
        if (owner === '$$$') owner = '___';
        let apiUsql = 'REACT_APP_APIHOST_USQL_' + owner + '_' + this.apiName;
        const usqlApiHost = process.env[apiUsql];
        console.log('name:' + apiUsql + ' value:' + usqlApiHost);
        let hash = document.location.hash;
        if (usqlApiHost !== undefined && 
            (hash === undefined || !hash.startsWith('#tv'))) {
            channel = new HttpChannel(false, usqlApiHost, undefined, channelUI);
        }
        else {
            let apiToken = await appApi(this.api, this.apiOwner, this.apiName);
            channel = new HttpChannel(false, apiToken.url, apiToken.token, channelUI);
        }
        return channels[this.api] = channel;
    }
}
