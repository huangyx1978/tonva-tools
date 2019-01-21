var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import _ from 'lodash';
import { HttpChannel } from './httpChannel';
import { HttpChannelNavUI } from './httpChannelUI';
import { appUsq } from './appBridge';
import { ApiBase } from './apiBase';
import { host } from './host';
let channelUIs = {};
let channelNoUIs = {};
export function logoutApis() {
    channelUIs = {};
    channelNoUIs = {};
    logoutUnitxApis();
}
const usqLocalEntities = 'usqLocalEntities';
class CacheUsqLocals {
    loadAccess(usqApi) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { usqOwner, usqName } = usqApi;
                if (this.local === undefined) {
                    let ls = localStorage.getItem(usqLocalEntities);
                    if (ls !== null) {
                        this.local = JSON.parse(ls);
                    }
                }
                if (this.local !== undefined) {
                    let { user, usqs } = this.local;
                    if (user !== loginedUserId || usqs === undefined) {
                        this.local = undefined;
                    }
                    else {
                        for (let i in usqs) {
                            let ul = usqs[i];
                            ul.isNet = undefined;
                        }
                    }
                }
                if (this.local === undefined) {
                    this.local = {
                        user: loginedUserId,
                        unit: undefined,
                        usqs: {}
                    };
                }
                let ret;
                let un = usqOwner + '/' + usqName;
                let usq = this.local.usqs[un];
                if (usq !== undefined) {
                    let { value } = usq;
                    ret = value;
                }
                if (ret === undefined) {
                    ret = yield usqApi.__loadAccess();
                    this.saveLocal(un, ret);
                    /*
                    this.local.usqs[un] = {
                        value: ret,
                        isNet: true,
                    }
                    let str = JSON.stringify(this.local);
                    localStorage.setItem(usqLocalEntities, str);
                    */
                }
                return _.cloneDeep(ret);
            }
            catch (err) {
                this.local = undefined;
                localStorage.removeItem(usqLocalEntities);
                throw err;
            }
        });
    }
    saveLocal(usqName, accessValue) {
        this.local.usqs[usqName] = {
            value: accessValue,
            isNet: true,
        };
        let str = JSON.stringify(this.local);
        localStorage.setItem(usqLocalEntities, str);
    }
    checkAccess(usqApi) {
        return __awaiter(this, void 0, void 0, function* () {
            let { usqOwner, usqName } = usqApi;
            let un = usqOwner + '/' + usqName;
            let usq = this.local.usqs[un];
            let { isNet, value } = usq;
            if (isNet === true)
                return true;
            let ret = yield usqApi.__loadAccess();
            let isMatch = _.isMatch(value, ret);
            if (isMatch === false) {
                this.saveLocal(un, ret);
            }
            return isMatch;
        });
    }
}
const localUsqs = new CacheUsqLocals;
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
            return yield this.get('update');
        });
    }
    __loadAccess() {
        return __awaiter(this, void 0, void 0, function* () {
            let acc = this.access === undefined ?
                '' :
                this.access.join('|');
            let ret = yield this.get('access', { acc: acc });
            return ret;
        });
    }
    loadAccess() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield localUsqs.loadAccess(this);
            /*
            let acc = this.access === undefined?
                '' :
                this.access.join('|');
            return await this.get('access', {acc:acc});
            */
        });
    }
    loadEntities() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get('entities');
        });
    }
    checkAccess() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield localUsqs.checkAccess(this);
        });
    }
    schema(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get('schema/' + name);
        });
    }
    schemas(names) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.post('schema', names);
        });
    }
    tuidGet(name, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get('tuid/' + name + '/' + id);
        });
    }
    tuidGetAll(name) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get('tuid-all/' + name + '/');
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
            return yield this.get('tuid-arr/' + name + '/' + owner + '/' + arr + '/' + id);
        });
    }
    tuidArrGetAll(name, arr, owner) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get('tuid-arr-all/' + name + '/' + owner + '/' + arr + '/');
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
                let ret = yield this.get(url);
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
            return yield this.get('sheet/' + name + '/statecount');
        });
    }
    getSheet(name, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get('sheet/' + name + '/get/' + id);
        });
    }
    sheetArchives(name, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.post('sheet/' + name + '/archives', data);
        });
    }
    sheetArchive(name, id) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get('sheet/' + name + '/archive/' + id);
        });
    }
    action(name, data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.post('action/' + name, data);
        });
    }
    page(name, pageStart, pageSize, params) {
        return __awaiter(this, void 0, void 0, function* () {
            let p;
            switch (typeof params) {
                case 'undefined':
                    p = { key: '' };
                    break;
                default:
                    p = _.clone(params);
                    break;
            }
            p['$pageStart'] = pageStart;
            p['$pageSize'] = pageSize;
            return yield this.post('query-page/' + name, p);
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
            return yield this.get('user');
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
            let realUrl = host.getUrlOrDebug(url, urlDebug);
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
export let centerToken = undefined;
let loginedUserId = 0;
export function setCenterToken(userId, t) {
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
const usqTokens = 'usqTokens';
export class UsqTokenApi extends CenterApi {
    usq(params) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let { unit: unitParam, usqOwner, usqName } = params;
                if (this.local === undefined) {
                    let ls = localStorage.getItem(usqTokens);
                    if (ls !== null) {
                        this.local = JSON.parse(ls);
                    }
                }
                if (this.local !== undefined) {
                    let { unit, user } = this.local;
                    if (unit !== unitParam || user !== loginedUserId)
                        this.local = undefined;
                }
                if (this.local === undefined) {
                    this.local = {
                        user: loginedUserId,
                        unit: params.unit,
                        usqs: {}
                    };
                }
                let un = usqOwner + '/' + usqName;
                let nowTick = new Date().getTime();
                let usq = this.local.usqs[un];
                if (usq !== undefined) {
                    let { tick, value } = usq;
                    if ((nowTick - tick) < 24 * 3600 * 1000) {
                        return value;
                    }
                }
                let ret = yield this.get('app-usq', params);
                this.local.usqs[un] = {
                    tick: nowTick,
                    value: ret,
                };
                localStorage.setItem(usqTokens, JSON.stringify(this.local));
                return ret;
            }
            catch (err) {
                this.local = undefined;
                localStorage.removeItem(usqTokens);
                throw err;
            }
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
export class CenterAppApi extends CenterApi {
    usqs(unit, appOwner, appName) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret;
            let ls = localStorage.getItem('appUsqs');
            if (ls !== null) {
                let rLs = JSON.parse(ls);
                let { unit: rUnit, appOwner: rAppOwner, appName: rAppName, value } = rLs;
                if (unit === rUnit && appOwner === rAppOwner && appName === rAppName)
                    ret = value;
            }
            if (ret === undefined) {
                ret = yield this.usqsPure(unit, appOwner, appName);
                let obj = {
                    unit: unit,
                    appOwner: appOwner,
                    appName: appName,
                    value: ret,
                };
                localStorage.setItem('appUsqs', JSON.stringify(obj));
            }
            return this.cachedUsqs = _.cloneDeep(ret);
        });
    }
    usqsPure(unit, appOwner, appName) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get('tie/app-usqs', { unit: unit, appOwner: appOwner, appName: appName });
        });
    }
    checkUsqs(unit, appOwner, appName) {
        return __awaiter(this, void 0, void 0, function* () {
            let ret = yield this.usqsPure(unit, appOwner, appName);
            return _.isMatch(this.cachedUsqs, ret);
        });
    }
    unitxUsq(unit) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.get('tie/unitx-usq', { unit: unit });
        });
    }
}
//# sourceMappingURL=usqApi.js.map