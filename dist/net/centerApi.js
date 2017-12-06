var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { HttpChannelNavUI } from './httpChannelUI';
import { HttpChannel } from './httpChannel';
import { ApiBase } from './apiBase';
const centerHost = process.env.REACT_APP_APIHOST;
let centerToken = undefined;
export function setCenterToken(t) {
    centerToken = t;
    if (t !== undefined) {
        centerChannel = undefined;
        centerChannelUI = undefined;
    }
}
let centerChannelUI;
let centerChannel;
function getCenterChannelUI() {
    if (centerChannelUI !== undefined)
        return centerChannelUI;
    return centerChannelUI = new HttpChannel(centerHost, centerToken, new HttpChannelNavUI());
}
function getCenterChannel() {
    if (centerChannel !== undefined)
        return centerChannel;
    return centerChannel = new HttpChannel(centerHost, centerToken);
}
export class CenterApi extends ApiBase {
    constructor(path, showWaiting) {
        super(path, showWaiting);
    }
    getHttpChannel() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.channel !== undefined)
                return this.channel;
            return this.channel = (this.showWaiting === true || this.showWaiting === undefined) ?
                getCenterChannelUI() :
                getCenterChannel();
        });
    }
}
export class ApiTokenApi extends CenterApi {
    api(params) {
        return this.get('app-api', params);
    }
}
export const apiTokenApi = new ApiTokenApi('tv/tie/');
//# sourceMappingURL=centerApi.js.map