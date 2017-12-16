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
let channelUIs = {};
let channelNoUIs = {};
export function logoutApis() {
    channelUIs = {};
    channelNoUIs = {};
}
export class Api extends ApiBase {
    constructor(path, apiName, showWaiting) {
        super(path, showWaiting);
        this.apiName = apiName ? apiName : undefined;
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
            let channel = channels[this.apiName];
            if (channel !== undefined)
                return channel;
            // await center Channel get api
            let apiToken = yield appApi(this.apiName);
            channel = new HttpChannel(false, apiToken.url, apiToken.token, channelUI);
            return channels[this.apiName] = channel;
        });
    }
}
//# sourceMappingURL=api.js.map