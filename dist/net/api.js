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
import { logoutUnitxApis } from './unitxApi';
let channelUIs = {};
let channelNoUIs = {};
export function logoutApis() {
    channelUIs = {};
    channelNoUIs = {};
    logoutUnitxApis();
}
export class Api extends ApiBase {
    constructor(basePath, apiOwner, apiName, showWaiting) {
        super(basePath, showWaiting);
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
            let apiToken = yield appApi(this.api, this.apiOwner, this.apiName);
            this.token = apiToken.token;
            channel = new HttpChannel(false, apiToken.url, apiToken.token, channelUI);
            return channels[this.api] = channel;
        });
    }
}
//# sourceMappingURL=api.js.map