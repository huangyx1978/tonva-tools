var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ApiBase, getUrlOrDebug } from './apiBase';
import { HttpChannel } from './httpChannel';
import { HttpChannelNavUI } from './httpChannelUI';
import { CenterAppApi } from './centerApi';
let channels = {};
export function logoutUnitxApis() {
    channels = {};
}
export class UnitxApi extends ApiBase {
    constructor(unitId) {
        super('tv/', true);
        this.unitId = unitId;
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
            let ret = yield centerAppApi.unitxApi(this.unitId);
            let { token, url, urlDebug } = ret;
            let realUrl = yield getUrlOrDebug(url, urlDebug);
            this.token = token;
            return new HttpChannel(false, realUrl, token, channelUI);
        });
    }
}
//# sourceMappingURL=unitxApi.js.map