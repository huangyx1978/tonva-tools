var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ApiBase } from './apiBase';
import { HttpChannel } from './httpChannel';
import { HttpChannelNavUI } from './httpChannelUI';
import { appApi } from './appBridge';
import { logoutChatApis } from './chatApi';
let channelUIs = {};
let channelNoUIs = {};
export function logoutApis() {
    channelUIs = {};
    channelNoUIs = {};
    logoutChatApis();
}
export class Api extends ApiBase {
    constructor(baseUrl, url, /*ws, */ apiOwner, apiName, showWaiting) {
        super(baseUrl, /*ws, */ showWaiting);
        this.url = url;
        if (apiName) {
            this.apiOwner = apiOwner;
            this.apiName = apiName;
            this.api = apiOwner + '/' + apiName;
        }
        this.showWaiting = showWaiting;
    }
    getHttpChannel() {
        return __awaiter(this, void 0, void 0, function* () {
            let channels;
            let channelUI;
            if (this.showWaiting === true || this.showWaiting === undefined) {
                channels = channelUIs;
                channelUI = new HttpChannelNavUI();
            }
            else {
                channels = channelNoUIs;
            }
            let channel = channels[this.api];
            if (channel !== undefined)
                return channel;
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
            let apiToken = yield appApi(this.api, this.apiOwner, this.apiName);
            this.token = apiToken.token;
            channel = new HttpChannel(false, apiToken.url, apiToken.token, channelUI);
            //}
            return channels[this.api] = channel;
        });
    }
}
//# sourceMappingURL=api.js.map