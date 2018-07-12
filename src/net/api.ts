import {ApiBase} from './apiBase';
import {HttpChannel} from './httpChannel';
import {HttpChannelUI, HttpChannelNavUI} from './httpChannelUI';
import {appApi} from './appBridge';
import {logoutChatApis} from './chatApi';
import { debug } from 'util';

let channelUIs:{[name:string]: HttpChannel} = {};
let channelNoUIs:{[name:string]: HttpChannel} = {};

export function logoutApis() {
    channelUIs = {};
    channelNoUIs = {};
    logoutChatApis();
}

export class Api extends ApiBase {
    url: string;
    apiOwner: string;
    apiName: string;
    api: string;

    constructor(baseUrl: string, url:string, /*ws, */apiOwner, apiName: string, showWaiting?: boolean) {
        super(baseUrl, /*ws, */showWaiting);
        this.url = url;
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
        
        /*
        let usqlApiHost:string;
        if (this.url === undefined) {
            // await center Channel get api
            let owner = this.apiOwner;
            if (owner === '$$$') owner = '___';
            let apiUsql = 'REACT_APP_APIHOST_USQL_' + owner + '_' + this.apiName;
            usqlApiHost = process.env[apiUsql];
            console.log('name:' + apiUsql + ' value:' + usqlApiHost);
        }
        else {
            usqlApiHost = this.url;
            console.log('apiUsql: %s', usqlApiHost);
        }
        let hash = document.location.hash;
        debugger;
        if (usqlApiHost !== undefined && 
            (hash === undefined || !hash.startsWith('#tv'))) {
            channel = new HttpChannel(false, usqlApiHost, undefined, channelUI);
        }
        else {
        */
            let apiToken = await appApi(this.api, this.apiOwner, this.apiName);
            this.token = apiToken.token;
            channel = new HttpChannel(false, apiToken.url, apiToken.token, channelUI);
        //}
        return channels[this.api] = channel;
    }
}
