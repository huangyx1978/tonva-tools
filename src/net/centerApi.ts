import {FetchError} from '../fetchError';
import {HttpChannelNavUI} from './httpChannelUI';
import {HttpChannel} from './httpChannel';
import {ApiBase} from './apiBase';

const centerHost = process.env.REACT_APP_APIHOST;
let centerToken:string|undefined = undefined;

export function setCenterToken(t?:string) {
    centerToken = t;
    if (t === undefined) {
        centerChannel = undefined;
        centerChannelUI = undefined;
    }
}

let centerChannelUI:HttpChannel;
let centerChannel:HttpChannel;
function getCenterChannelUI():HttpChannel {
    if (centerChannelUI !== undefined) return centerChannelUI;
    return centerChannelUI = new HttpChannel(centerHost, centerToken, new HttpChannelNavUI());
}
function getCenterChannel():HttpChannel {
    if (centerChannel !== undefined) return centerChannel;
    return centerChannel = new HttpChannel(centerHost, centerToken);
}

export async function refetchApi(url, options, resolve, reject) {
    await centerChannelUI.fetch(url, options, resolve, reject);
}

export abstract class CenterApi extends ApiBase {
    private channel: HttpChannel;

    constructor(path: string, showWaiting?: boolean) {
        super(path, showWaiting);
    }

    protected async getHttpChannel(): Promise<HttpChannel> {
        if (this.channel !== undefined) return this.channel;
        return this.channel = (this.showWaiting === true || this.showWaiting === undefined)?
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
