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
const apiBase_1 = require("./apiBase");
const httpChannel_1 = require("./httpChannel");
const app_1 = require("./app");
const channelUIs = {};
const channelNoUIs = {};
class Api extends apiBase_1.ApiBase {
    constructor(path, apiName, showWaiting) {
        super(path, showWaiting);
        this.apiName = apiName ? apiName : undefined;
        this.showWaiting = showWaiting;
    }
    getHttpChannel() {
        return __awaiter(this, void 0, void 0, function* () {
            let channels;
            if (this.showWaiting === true || this.showWaiting === undefined) {
                channels = channelUIs;
            }
            else {
                channels = channelNoUIs;
            }
            let channel = channels[this.apiName];
            if (channel !== undefined)
                return channel;
            // await center Channel get api
            let apiToken = yield app_1.appApi(this.apiName);
            channel = new httpChannel_1.HttpChannel(apiToken.url, apiToken.token);
            return channels[this.apiName] = channel;
        });
    }
}
exports.Api = Api;
//# sourceMappingURL=api.js.map