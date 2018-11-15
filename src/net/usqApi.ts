import * as _ from 'lodash';
import {HttpChannel} from './httpChannel';
import {HttpChannelUI, HttpChannelNavUI} from './httpChannelUI';
import {appUsq} from './appBridge';
import {ApiBase, getUrlOrDebug} from './apiBase';

let channelUIs:{[name:string]: HttpChannel} = {};
let channelNoUIs:{[name:string]: HttpChannel} = {};

export function logoutApis() {
    channelUIs = {};
    channelNoUIs = {};
    logoutUnitxApis();
}

export class UsqApi extends ApiBase {
    private access:string[];
    usqOwner: string;
    usqName: string;
    usq: string;

    constructor(basePath: string, usqOwner, usqName: string, access:string[], showWaiting?: boolean) {
        super(basePath, showWaiting);
        if (usqName) {
            this.usqOwner = usqOwner;
            this.usqName = usqName;
            this.usq = usqOwner + '/' + usqName;
        }
        this.access = access;
        this.showWaiting = showWaiting;
    }

    protected async getHttpChannel(): Promise<HttpChannel> {
        let channels: {[name:string]: HttpChannel};
        let channelUI: HttpChannelNavUI;
        if (this.showWaiting === true || this.showWaiting === undefined) {
            channels = channelUIs;
            channelUI = new HttpChannelNavUI();
        }
        else {
            channels = channelNoUIs;
        }
        let channel = channels[this.usq];
        if (channel !== undefined) return channel;
        let usqToken = await appUsq(this.usq, this.usqOwner, this.usqName);
        this.token = usqToken.token;
        channel = new HttpChannel(false, usqToken.url, usqToken.token, channelUI);
        return channels[this.usq] = channel;
    }


    async update():Promise<string> {
        return await this.get('update');
    }

    async loadAccess():Promise<any> {
        let acc = this.access === undefined?
            '' :
            this.access.join('|');
        return await this.get('access', {acc:acc});
    }

    async loadEntities():Promise<any> {
        return await this.get('entities');
    }

    async schema(name:string):Promise<any> {
        return await this.get('schema/' + name);
    }

    async schemas(names:string[]):Promise<any[]> {
        return await this.post('schema', names);
    }

    async tuidGet(name:string, id:number):Promise<any> {
        return await this.get('tuid/' + name + '/' + id);
    }

    async tuidGetAll(name:string):Promise<any[]> {
        return await this.get('tuid-all/' + name + '/');
    }

    async tuidSave(name:string, params):Promise<any> {
        return await this.post('tuid/' + name, params);
    }

    async tuidSearch(name:string, arr:string, owner:number, key:string, pageStart:string|number, pageSize:number):Promise<any> {
        let ret = await this.post('tuids/' + name, {
            arr: arr,
            owner: owner,
            key: key,
            pageStart: pageStart,
            pageSize: pageSize
        });
        return ret;
    }
    async tuidArrGet(name:string, arr:string, owner:number, id:number):Promise<any> {
        return await this.get('tuid-arr/' + name + '/' + owner + '/' + arr + '/' + id);
    }
    async tuidArrGetAll(name:string, arr:string, owner:number):Promise<any[]> {
        return await this.get('tuid-arr-all/' + name + '/' + owner + '/' + arr + '/');
    }
    async tuidArrSave(name:string, arr:string, owner:number, params):Promise<any> {
        return await this.post('tuid-arr/' + name + '/' + owner + '/' + arr + '/', params);
    }
    async tuidArrPos(name:string, arr:string, owner:number, id:number, order:number):Promise<any> {
        return await this.post('tuid-arr-pos/' + name + '/' + owner + '/' + arr + '/', {
            id: id,
            $order: order
        });
    }

    async tuidIds(name:string, arr:string, ids:number[]):Promise<any[]> {
        try {
            let url = 'tuidids/' + name + '/';
            if (arr !== undefined) url += arr;
            else url += '$';
            let ret = await this.post(url, ids);
            return ret;
        }
        catch (e) {
            console.error(e);
        }
    }

    async proxied(name:string, proxy:string, id:number):Promise<any> {
        try {
            let url = 'tuid-proxy/' + name + '/' + proxy + '/' + id;
            let ret = await this.get(url);
            return ret;
        }
        catch (e) {
            console.error(e);
        }
    }

    async sheetSave(name:string, data:object):Promise<any> {
        return await this.post('sheet/' + name, data);
    }

    async sheetAction(name:string, data:object) {
        return await this.put('sheet/' + name, data);
    }

    async stateSheets(name:string, data:object) {
        return await this.post('sheet/' + name + '/states', data);
    }

    async stateSheetCount(name:string):Promise<any> {
        return await this.get('sheet/' + name + '/statecount');
    }

    async getSheet(name:string, id:number):Promise<any> {
        return await this.get('sheet/' + name + '/get/' + id);
    }

    async sheetArchives(name:string, data:object):Promise<any> {
        return await this.post('sheet/' + name + '/archives', data);
    }

    async sheetArchive(name:string, id:number):Promise<any> {
        return await this.get('sheet/' + name + '/archive/' + id);
    }

    async action(name:string, data:object):Promise<any> {
        return await this.post('action/' + name, data);
    }

    async page(name:string, pageStart:any, pageSize:number, params:any):Promise<string> {
        let p:any;
        switch (typeof params) {
            case 'undefined': p = {key: ''}; break;
            default: p = _.clone(params); break;
        }
        p['$pageStart'] = pageStart;
        p['$pageSize'] = pageSize;
        return await this.post('query-page/' + name, p);
    }

    async query(name:string, params:any):Promise<any> {
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
    async user():Promise<any> {
        return await this.get('user');
    }
}

let channels:{[unitId:number]: HttpChannel} = {};

export function logoutUnitxApis() {
    channels = {};
}

export class UnitxApi extends UsqApi {
    private unitId:number;
    constructor(unitId:number) {
        super('tv/', undefined, undefined, undefined, true);
        this.unitId = unitId;
    }

    protected async getHttpChannel(): Promise<HttpChannel> {
        let channel = channels[this.unitId];
        if (channel !== undefined) return channel;
        return channels[this.unitId] = await this.buildChannel();
    }

    private async buildChannel():Promise<HttpChannel> {
        let channelUI = new HttpChannelNavUI();
        let centerAppApi = new CenterAppApi('tv/', undefined);
        let ret = await centerAppApi.unitxUsq(this.unitId);
        let {token, url, urlDebug} = ret;
        let realUrl = await getUrlOrDebug(url, urlDebug);
        this.token = token;
        return new HttpChannel(false, realUrl, token, channelUI);
    }
}

let centerHost:string;

export function setCenterUrl(url:string) {
    console.log('setCenterUrl %s', url);
    centerHost = url;
    centerToken = undefined;
    centerChannel = undefined;
    centerChannelUI = undefined;
}

export function getCenterUrl():string {
    return centerHost;
}

export let centerToken:string|undefined = undefined;

export function setCenterToken(t?:string) {
    centerToken = t;
    console.log('setCenterToken %s', t);
    centerChannel = undefined;
    centerChannelUI = undefined;
}

let centerChannelUI:HttpChannel;
let centerChannel:HttpChannel;
function getCenterChannelUI():HttpChannel {
    if (centerChannelUI !== undefined) return centerChannelUI;
    return centerChannelUI = new HttpChannel(true, centerHost, centerToken, new HttpChannelNavUI());
}
function getCenterChannel():HttpChannel {
    if (centerChannel !== undefined) return centerChannel;
    return centerChannel = new HttpChannel(true, centerHost, centerToken);
}

export abstract class CenterApi extends ApiBase {
    constructor(path: string, showWaiting?: boolean) {
        super(path, showWaiting);
    }

    protected async getHttpChannel(): Promise<HttpChannel> {
        return (this.showWaiting === true || this.showWaiting === undefined)?
            getCenterChannelUI():
            getCenterChannel();
    }
}

export class UsqTokenApi extends CenterApi {
    async usq(params: {unit:number, usqOwner:string, usqName:string}):Promise<any> {
        return await this.get('app-usq', params);
    }
}

export const usqTokenApi = new UsqTokenApi('tv/tie/', undefined);

export class CallCenterApi extends CenterApi {
    directCall(url:string, method:string, body:any):Promise<any> {
        return this.call(url, method, body);
    }
}
export const callCenterapi = new CallCenterApi('', undefined);

export interface App {
    id: number;
    usqs: AppUsq[];
}

export interface AppUsq {
    id: number;
    usqOwner: string;
    usqName: string;
    url: string;
    urlDebug: string;
    ws: string;
    wsDebug: string;
    access: string;
    token: string;
}
console.log('CenterApi');
console.log(CenterApi);
export class CenterAppApi extends CenterApi {
    async usqs(unit:number, appOwner:string, appName:string):Promise<App> {
        return await this.get('tie/app-usqs', {unit:unit, appOwner:appOwner, appName:appName});
    }
    async unitxUsq(unit:number):Promise<AppUsq> {
        return await this.get('tie/unitx-usq', {unit:unit});
    }
}
