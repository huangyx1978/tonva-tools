import {isDevelopment} from '../local';
import {HttpChannel} from './httpChannel';
import {centerDebugHost} from './centerDebugHost';
import {fetchLocalCheck} from './fetchLocalCheck';

export async function refetchApi(channel:HttpChannel, url, options, resolve, reject) {
    await channel.fetch(url, options, resolve, reject);
}

export abstract class ApiBase {
    protected token: string;
    protected path: string;
    protected showWaiting: boolean;

    constructor(path: string, showWaiting: boolean) {
        this.path = path || '';
        this.showWaiting = showWaiting;
    }

    protected abstract async getHttpChannel(): Promise<HttpChannel>;

    public async call(url:string, method:string, body:any):Promise<any> {
        let channel = await this.getHttpChannel();
        return await channel.callFetch(url, method, body);
    }

    public async get(path:string, params:any): Promise<any> {
        let channel = await this.getHttpChannel();
        return await channel.get(this.path + path, params);
    }

    public async post(path:string, params:any): Promise<any> {
        let channel = await this.getHttpChannel();
        return await channel.post(this.path + path, params);
    }

    public async put(path:string, params:any): Promise<any> {
        let channel = await this.getHttpChannel();
        return await channel.put(this.path + path, params);
    }

    public async delete(path:string, params:any): Promise<any> {
        let channel = await this.getHttpChannel();
        return await channel.delete(this.path + path, params);
    }
}

export async function getUrlOrDebug(url:string, urlDebug:string):Promise<string> {
    if (isDevelopment !== true) return url;
    try {
        if (urlDebug.endsWith('/') === false) urlDebug += '/';
        let hostString = '://centerhost:';
        let pos = urlDebug.indexOf(hostString);
        console.log("let pos = urlDebug.indexOf(hostString); pos=%s, urlDebug=%s", pos, urlDebug);
        if (pos > 0) {
            let centerHost = process.env.REACT_APP_CENTER_DEBUG_HOST || centerDebugHost;
            console.log("let centerHost = process.env.REACT_APP_CENTER_DEBUG_HOST || centerDebugHost;centerHost=%s", centerHost);
            urlDebug = urlDebug.replace(hostString, '://' + centerHost + ':');
        }
        let fetchUrl = urlDebug + 'hello';
        let fetchOptions = {
            method: "GET",
            mode: "no-cors", // no-cors, cors, *same-origin
            headers: {
                "Content-Type": "text/plain"
            },
        };
        let ret = await fetchLocalCheck(fetchUrl, fetchOptions);
        let text = await ret.text();
        return urlDebug;
    }
    catch {
        console.log('cannot connect %s, so use %s', urlDebug, url);
        return url;
    }
}
