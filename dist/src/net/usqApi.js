var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import * as _ from 'lodash';
import { HttpChannel } from './httpChannel';
import { HttpChannelNavUI } from './httpChannelUI';
import { appUsq } from './appBridge';
import { ApiBase, getUrlOrDebug } from './apiBase';
let channelUIs = {};
let channelNoUIs = {};
export function logoutApis() {
    channelUIs = {};
    channelNoUIs = {};
    logoutUnitxApis();
}
export class UsqApi extends ApiBase {
    constructor(basePath, usqOwner, usqName, access, showWaiting) {
        super(basePath, showWaiting);
        if (usqName) {
            this.usqOwner = usqOwner;
            this.usqName = usqName;
            this.usq = usqOwner + '/' + usqName;
        }
        this.access = access;
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
            let usqToken = yield appUsq(this.usq, this.usqOwner, this.usqName);
            this.token = usqToken.token;
            channel = new HttpChannel(false, usqToken.url, usqToken.token, channelUI);
            return channels[this.usq] = channel;
        });
    }
    update() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get('update', {});
        });
    }
    loadAccess() {
        return __awaiter(this, void 0, void 0, function* () {
            let acc = this.access === undefined ?
                '' :
                this.access.join('|');
            return yield this.get('access', { acc: acc });
        });
    }
    schema(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get('schema/' + name, undefined);
        });
    }
    schemas(names) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.post('schema', names);
        });
    }
    tuidGet(name, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get('tuid/' + name + '/' + id, {});
        });
    }
    tuidGetAll(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get('tuid-all/' + name + '/', {});
        });
    }
    tuidSave(name, params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.post('tuid/' + name, params);
        });
    }
    tuidSearch(name, arr, owner, key, pageStart, pageSize) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.post('tuids/' + name, {
                arr: arr,
                owner: owner,
                key: key,
                pageStart: pageStart,
                pageSize: pageSize
            });
            return ret;
        });
    }
    tuidArrGet(name, arr, owner, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get('tuid-arr/' + name + '/' + owner + '/' + arr + '/' + id, {});
        });
    }
    tuidArrGetAll(name, arr, owner) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get('tuid-arr-all/' + name + '/' + owner + '/' + arr + '/', {});
        });
    }
    tuidArrSave(name, arr, owner, params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.post('tuid-arr/' + name + '/' + owner + '/' + arr + '/', params);
        });
    }
    tuidArrPos(name, arr, owner, id, order) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.post('tuid-arr-pos/' + name + '/' + owner + '/' + arr + '/', {
                id: id,
                $order: order
            });
        });
    }
    tuidIds(name, arr, ids) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let url = 'tuidids/' + name + '/';
                if (arr !== undefined)
                    url += arr;
                else
                    url += '$';
                let ret = yield this.post(url, ids);
                return ret;
            }
            catch (e) {
                console.error(e);
            }
        });
    }
    proxied(name, proxy, id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let url = 'tuid-proxy/' + name + '/' + proxy + '/' + id;
                let ret = yield this.get(url, undefined);
                return ret;
            }
            catch (e) {
                console.error(e);
            }
        });
    }
    sheetSave(name, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.post('sheet/' + name, data);
        });
    }
    sheetAction(name, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.put('sheet/' + name, data);
        });
    }
    stateSheets(name, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.post('sheet/' + name + '/states', data);
        });
    }
    stateSheetCount(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get('sheet/' + name + '/statecount', undefined);
        });
    }
    getSheet(name, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get('sheet/' + name + '/get/' + id, undefined);
        });
    }
    sheetArchives(name, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.post('sheet/' + name + '/archives', data);
        });
    }
    sheetArchive(name, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get('sheet/' + name + '/archive/' + id, undefined);
        });
    }
    action(name, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.post('action/' + name, data);
        });
    }
    queryPage(queryApi, name, pageStart, pageSize, params) {
        return __awaiter(this, void 0, void 0, function* () {
            let p = _.clone(params || {});
            p['$pageStart'] = pageStart;
            p['$pageSize'] = pageSize;
            return yield this.post(queryApi + '/' + name, p);
        });
    }
    query(name, params) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.post('query/' + name, params);
            return ret;
        });
    }
    /*
        async history(name:string, pageStart:any, pageSize:number, params:any):Promise<string> {
            let p = _.clone(params);
            p['$pageStart'] = pageStart;
            p['$pageSize'] = pageSize;
            let ret = await this.post('history/' + name, p);
            return ret;
        }
    
        async book(name:string, pageStart:any, pageSize:number, params:any):Promise<string> {
            let p = _.clone(params);
            p['$pageStart'] = pageStart;
            p['$pageSize'] = pageSize;
            let ret = await this.post('history/' + name, p);
            return ret;
        }
    */
    user() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get('user', undefined);
        });
    }
}
let channels = {};
export function logoutUnitxApis() {
    channels = {};
}
export class UnitxApi extends UsqApi {
    constructor(unitId) {
        super('tv/', undefined, undefined, undefined, true);
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
export class UsqTokenApi extends CenterApi {
    usq(params) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get('app-usq', params);
        });
    }
}
export const usqTokenApi = new UsqTokenApi('tv/tie/', undefined);
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
//# sourceMappingURL=usqApi.js.map