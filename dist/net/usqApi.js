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
    async getHttpChannel() {
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
        let usqToken = await appUsq(this.usq, this.usqOwner, this.usqName);
        this.token = usqToken.token;
        channel = new HttpChannel(false, usqToken.url, usqToken.token, channelUI);
        return channels[this.usq] = channel;
    }
    async update() {
        return await this.get('update', {});
    }
    async loadAccess() {
        let acc = this.access === undefined ?
            '' :
            this.access.join('|');
        return await this.get('access', { acc: acc });
    }
    async schema(name) {
        return await this.get('schema/' + name, undefined);
    }
    async schemas(names) {
        return await this.post('schema', names);
    }
    async tuidGet(name, id) {
        return await this.get('tuid/' + name + '/' + id, {});
    }
    async tuidGetAll(name) {
        return await this.get('tuid-all/' + name + '/', {});
    }
    async tuidSave(name, params) {
        return await this.post('tuid/' + name, params);
    }
    async tuidSearch(name, arr, owner, key, pageStart, pageSize) {
        let ret = await this.post('tuids/' + name, {
            arr: arr,
            owner: owner,
            key: key,
            pageStart: pageStart,
            pageSize: pageSize
        });
        return ret;
    }
    async tuidArrGet(name, arr, owner, id) {
        return await this.get('tuid-arr/' + name + '/' + owner + '/' + arr + '/' + id, {});
    }
    async tuidArrGetAll(name, arr, owner) {
        return await this.get('tuid-arr-all/' + name + '/' + owner + '/' + arr + '/', {});
    }
    async tuidArrSave(name, arr, owner, params) {
        return await this.post('tuid-arr/' + name + '/' + owner + '/' + arr + '/', params);
    }
    async tuidArrPos(name, arr, owner, id, order) {
        return await this.post('tuid-arr-pos/' + name + '/' + owner + '/' + arr + '/', {
            id: id,
            $order: order
        });
    }
    async tuidIds(name, arr, ids) {
        try {
            let url = 'tuidids/' + name + '/';
            if (arr !== undefined)
                url += arr;
            else
                url += '$';
            let ret = await this.post(url, ids);
            return ret;
        }
        catch (e) {
            console.error(e);
        }
    }
    async proxied(name, proxy, id) {
        try {
            let url = 'tuid-proxy/' + name + '/' + proxy + '/' + id;
            let ret = await this.get(url, undefined);
            return ret;
        }
        catch (e) {
            console.error(e);
        }
    }
    async sheetSave(name, data) {
        return await this.post('sheet/' + name, data);
    }
    async sheetAction(name, data) {
        return await this.put('sheet/' + name, data);
    }
    async stateSheets(name, data) {
        return await this.post('sheet/' + name + '/states', data);
    }
    async stateSheetCount(name) {
        return await this.get('sheet/' + name + '/statecount', undefined);
    }
    async getSheet(name, id) {
        return await this.get('sheet/' + name + '/get/' + id, undefined);
    }
    async sheetArchives(name, data) {
        return await this.post('sheet/' + name + '/archives', data);
    }
    async sheetArchive(name, id) {
        return await this.get('sheet/' + name + '/archive/' + id, undefined);
    }
    async action(name, data) {
        return await this.post('action/' + name, data);
    }
    async queryPage(queryApi, name, pageStart, pageSize, params) {
        let p = _.clone(params || {});
        p['$pageStart'] = pageStart;
        p['$pageSize'] = pageSize;
        return await this.post(queryApi + '/' + name, p);
    }
    async query(name, params) {
        let ret = await this.post('query/' + name, params);
        return ret;
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
    async user() {
        return await this.get('user', undefined);
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
    async getHttpChannel() {
        let channel = channels[this.unitId];
        if (channel !== undefined)
            return channel;
        return channels[this.unitId] = await this.buildChannel();
    }
    async buildChannel() {
        let channelUI = new HttpChannelNavUI();
        let centerAppApi = new CenterAppApi('tv/', undefined);
        let ret = await centerAppApi.unitxUsq(this.unitId);
        let { token, url, urlDebug } = ret;
        let realUrl = await getUrlOrDebug(url, urlDebug);
        this.token = token;
        return new HttpChannel(false, realUrl, token, channelUI);
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
    async getHttpChannel() {
        return (this.showWaiting === true || this.showWaiting === undefined) ?
            getCenterChannelUI() :
            getCenterChannel();
    }
}
export class UsqTokenApi extends CenterApi {
    async usq(params) {
        return await this.get('app-usq', params);
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
    async usqs(unit, appOwner, appName) {
        return await this.get('tie/app-usqs', { unit: unit, appOwner: appOwner, appName: appName });
    }
    async unitxUsq(unit) {
        return await this.get('tie/unitx-usq', { unit: unit });
    }
}
//# sourceMappingURL=usqApi.js.map