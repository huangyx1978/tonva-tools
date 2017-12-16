import {FetchError} from '../fetchError';
import {HttpChannelNavUI} from './httpChannelUI';
import {HttpChannel} from './httpChannel';
import {ApiBase} from './apiBase';

const centerHost = process.env.REACT_APP_APIHOST;
let centerToken:string|undefined = undefined;

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
    //private channel: HttpChannel;

    constructor(path: string, showWaiting?: boolean) {
        super(path, showWaiting);
    }

    protected async getHttpChannel(): Promise<HttpChannel> {
        return (this.showWaiting === true || this.showWaiting === undefined)?
            getCenterChannelUI():
            getCenterChannel();
    }
}

export class ApiTokenApi extends CenterApi {
    api(params: {unit:number, app:number, apiName:string}) {
        return this.get('app-api', params);
    }
}

export const apiTokenApi = new ApiTokenApi('tv/tie/');


export class CallCenterApi extends CenterApi {
    directCall(url:string, method:string, body:any):Promise<any> {
        return this.call(url, method, body);
    }
}
export const callCenterapi = new CallCenterApi('');
