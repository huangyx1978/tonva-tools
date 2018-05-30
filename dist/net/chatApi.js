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
import { CenterAppApi } from './centerApi';
let channels = {};
export function logoutChatApis() {
    channels = {};
}
export class ChatApi extends ApiBase {
    /*
    url: string;
    apiOwner: string;
    apiName: string;
    api: string;
    */
    constructor(unitId) {
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
    getHttpChannel() {
        return __awaiter(this, void 0, void 0, function* () {
            let channel = channels[this.unitId];
            if (channel !== undefined)
                return channel;
            return channels[this.unitId] = yield this.buildChannel();
        });
    }
    buildChannel() {
        return __awaiter(this, void 0, void 0, function* () {
            let channelUI = new HttpChannelNavUI();
            let centerAppApi = new CenterAppApi('tv/', undefined);
            let ret = yield centerAppApi.chatApi(this.unitId);
            let { token, url, urlDebug, ws, wsDebug } = ret;
            if (process.env.NODE_ENV === 'development') {
                if (urlDebug !== undefined)
                    url = urlDebug;
                if (wsDebug !== undefined)
                    ws = wsDebug;
            }
            this.ws = ws;
            this.token = token;
            return new HttpChannel(false, url, token, channelUI);
        });
    }
}
//# sourceMappingURL=chatApi.js.map