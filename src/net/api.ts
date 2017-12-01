import {nav} from '../ui/nav';
import {FetchError} from '../fetchError';
import {HttpChannel, HttpChannelUI} from './httpChannel';

class HttpChannelNavUI implements HttpChannelUI {
    startWait() {
        nav.startWait();
    }
    endWait() {
        nav.endWait();
    }
    async showError(error:FetchError):Promise<void> {
        nav.endWait();
        /*
        if (error.name === 'SyntaxError') {
            error = {
                name: error.name,
                message: error.message,
            }
        }*/
        await nav.onError(error);
    }
}

// 应该用上面的NavUI
const centerChannelUI = new HttpChannel(new HttpChannelNavUI());

export async function refetchApi(url, options, resolve, reject) {
    await centerChannelUI.fetch(url, options, resolve, reject);
}

const channelUIs:{[name:string]: HttpChannel} = {};
const channelNoUIs:{[name:string]: HttpChannel} = {};

export abstract class ApiNav {
    private path:string;

    constructor(path: string, apiName?: string) {
        this.path = path || '';
    }

    protected get(path:string, params:any): Promise<any> {
        return centerChannelUI.get(this.path + path, params);
    }

    protected post(path:string, params:any): Promise<any> {
        return centerChannelUI.post(this.path + path, params);
    }

    protected put(path:string, params:any): Promise<any> {
        return centerChannelUI.put(this.path + path, params);
    }

    protected delete(path:string, params:any): Promise<any> {
        return centerChannelUI.delete(this.path + path, params);
    }
}

// 应该用上面的NavUI
const centerChannelNoUI = new HttpChannel();

export abstract class ApiBase {
    private path: string;
    protected showWaiting: boolean;

    constructor(path: string, showWaiting: boolean) {
        this.path = path || '';
        this.showWaiting = showWaiting;
    }

    protected abstract async getHttpChannel(): Promise<HttpChannel>;

    protected async get(path:string, params:any): Promise<any> {
        let channel = await this.getHttpChannel();
        return await channel.get(this.path + path, params);
    }

    protected async post(path:string, params:any): Promise<any> {
        let channel = await this.getHttpChannel();
        return await channel.post(this.path + path, params);
    }

    protected async put(path:string, params:any): Promise<any> {
        let channel = await this.getHttpChannel();
        return await channel.put(this.path + path, params);
    }

    protected async delete(path:string, params:any): Promise<any> {
        let channel = await this.getHttpChannel();
        return await channel.delete(this.path + path, params);
    }
}

export abstract class Api extends ApiBase {
    private apiName: string;

    constructor(path: string, apiName: string, showWaiting?: boolean) {
        super(path, showWaiting);
        this.apiName = apiName? apiName : undefined;
        this.showWaiting = showWaiting;
    }

    protected async getHttpChannel(): Promise<HttpChannel> {
        let channels: {[name:string]: HttpChannel};
        let centerChannel: HttpChannel;
        if (this.showWaiting === true || this.showWaiting === undefined) {
            channels = channelUIs;
            centerChannel = centerChannelUI;
        }
        else {
            channels = channelNoUIs;
            centerChannel = centerChannelNoUI;
        }
        let channel = channels[this.apiName];
        if (channel !== undefined) return channel;
        
        // await center Channel get api
        return ;
    }
}

export abstract class CenterApi extends ApiBase {
    constructor(path: string, showWaiting?: boolean) {
        super(path, showWaiting);
    }

    protected async getHttpChannel(): Promise<HttpChannel> {
        return (this.showWaiting === true || this.showWaiting === undefined)?
            centerChannelUI :
            centerChannelNoUI;
    }
}
