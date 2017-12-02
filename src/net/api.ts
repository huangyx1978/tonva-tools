import {ApiBase} from './apiBase';
import {HttpChannel} from './httpChannel';
import {HttpChannelUI} from './httpChannelUI';
import {appApi} from './app';

const channelUIs:{[name:string]: HttpChannel} = {};
const channelNoUIs:{[name:string]: HttpChannel} = {};

export class Api extends ApiBase {
    private apiName: string;

    constructor(path: string, apiName: string, showWaiting?: boolean) {
        super(path, showWaiting);
        this.apiName = apiName? apiName : undefined;
        this.showWaiting = showWaiting;
    }

    protected async getHttpChannel(): Promise<HttpChannel> {
        let channels: {[name:string]: HttpChannel};
        if (this.showWaiting === true || this.showWaiting === undefined) {
            channels = channelUIs;
        }
        else {
            channels = channelNoUIs;
        }
        let channel = channels[this.apiName];
        if (channel !== undefined) return channel;
        
        // await center Channel get api
        let apiToken = await appApi(this.apiName);
        channel = new HttpChannel(apiToken.url, apiToken.token);
        return channels[this.apiName] = channel;
    }
}

//import {Api} from 'tonva-tools';

export class TestApi extends Api {
    async v(param: {}):Promise<any> {
        return this.get('v', param);
    }
}

//const testApi = new TestApi("/v", "v");
//export default testApi;
