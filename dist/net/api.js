var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { HttpChannel } from './httpChannel';
import { HttpChannelNavUI } from './httpChannelUI';
import { appApi } from './appBridge';
import { ApiBase, getUrlOrDebug } from './apiBase';
let channelUIs = {};
let channelNoUIs = {};
export function logoutApis() {
    channelUIs = {};
    channelNoUIs = {};
    logoutUnitxApis();
}
export class Usq extends ApiBase {
    constructor(basePath, usqOwner, usqName, showWaiting) {
        super(basePath, showWaiting);
        if (usqName) {
            this.usqOwner = usqOwner;
            this.usqName = usqName;
            this.usq = usqOwner + '/' + usqName;
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
            let channel = channels[this.usq];
            if (channel !== undefined)
                return channel;
            let apiToken = yield appApi(this.usq, this.usqOwner, this.usqName);
            this.token = apiToken.token;
            channel = new HttpChannel(false, apiToken.url, apiToken.token, channelUI);
            return channels[this.usq] = channel;
        });
    }
}
let channels = {};
export function logoutUnitxApis() {
    channels = {};
}
export class UnitxApi extends Usq {
    constructor(unitId) {
        super('tv/', undefined, undefined, true);
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
            let ret = yield centerAppApi.unitxUsq(this.unitId);
            let { token, url, urlDebug } = ret;
            let realUrl = yield getUrlOrDebug(url, urlDebug);
            this.token = token;
            return new HttpChannel(false, realUrl, token, channelUI);
        });
    }
}
let centerHost; 
export function setCenterUrl(url) {
    console.log('setCenterUrl %s', url);
    centerHost = url;
    centerToken = undefined;
    centerChannel = undefined;
    centerChannelUI = undefined;
}
export function getCenterUrl() {
    return centerHost;
}
export let centerToken = undefined;
export function setCenterToken(t) {
    centerToken = t;
    console.log('setCenterToken %s', t);
    centerChannel = undefined;
    centerChannelUI = undefined;
}
let centerChannelUI;
let centerChannel;
function getCenterChannelUI() {
    if (centerChannelUI !== undefined)
        return centerChannelUI;
    return centerChannelUI = new HttpChannel(true, centerHost, centerToken, new HttpChannelNavUI());
}
function getCenterChannel() {
    if (centerChannel !== undefined)
        return centerChannel;
    return centerChannel = new HttpChannel(true, centerHost, centerToken);
}
export class CenterApi extends ApiBase {
    constructor(path, showWaiting) {
        super(path, showWaiting);
    }
    getHttpChannel() {
        return __awaiter(this, void 0, void 0, function* () {
            return (this.showWaiting === true || this.showWaiting === undefined) ?
                getCenterChannelUI() :
                getCenterChannel();
        });
    }
}
export class ApiTokenApi extends CenterApi {
    api(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get('app-api', params);
        });
    }
}
export const apiTokenApi = new ApiTokenApi('tv/tie/', undefined);
export class CallCenterApi extends CenterApi {
    directCall(url, method, body) {
        return this.call(url, method, body);
    }
}
export const callCenterapi = new CallCenterApi('', undefined);
console.log('CenterApi');
console.log(CenterApi);
export class CenterAppApi extends CenterApi {
    usqs(unit, appOwner, appName) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get('tie/app-usqs', { unit: unit, appOwner: appOwner, appName: appName });
        });
    }
    unitxUsq(unit) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get('tie/unitx-usq', { unit: unit });
        });
    }
}
//# sourceMappingURL=api.js.map