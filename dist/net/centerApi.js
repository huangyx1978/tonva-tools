"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const httpChannelUI_1 = require("./httpChannelUI");
const httpChannel_1 = require("./httpChannel");
const apiBase_1 = require("./apiBase");
const centerHost = process.env.REACT_APP_APIHOST;
let centerToken = undefined;
function setCenterToken(t) {
    centerToken = t;
    if (t === undefined) {
        centerChannel = undefined;
        centerChannelUI = undefined;
    }
}
exports.setCenterToken = setCenterToken;
let centerChannelUI;
let centerChannel;
function getCenterChannelUI() {
    if (centerChannelUI !== undefined)
        return centerChannelUI;
    return centerChannelUI = new httpChannel_1.HttpChannel(centerHost, centerToken, new httpChannelUI_1.HttpChannelNavUI());
}
function getCenterChannel() {
    if (centerChannel !== undefined)
        return centerChannel;
    return centerChannel = new httpChannel_1.HttpChannel(centerHost, centerToken);
}
function refetchApi(url, options, resolve, reject) {
    return __awaiter(this, void 0, void 0, function* () {
        yield centerChannelUI.fetch(url, options, resolve, reject);
    });
}
exports.refetchApi = refetchApi;
class CenterApi extends apiBase_1.ApiBase {
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
exports.CenterApi = CenterApi;
class ApiTokenApi extends CenterApi {
    api(params) {
        return this.get('api', params);
    }
}
exports.ApiTokenApi = ApiTokenApi;
exports.apiTokenApi = new ApiTokenApi('tv/token');
//# sourceMappingURL=centerApi.js.map