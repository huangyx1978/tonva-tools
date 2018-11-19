import {isDevelopment} from '../local';
import {HttpChannel} from './httpChannel';
import {centerDebugHost, usqDebugHost, debugUsqlServer} from './debugHost';
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

    public async get(path:string, params:any=undefined): Promise<any> {
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

function replaceUrlHost(url:string, hostString:string, defaultHost:string, envHost:string) {
    //let hostString = '://centerhost:';
    let pos = url.indexOf(hostString);
    if (pos > 0) {
        let host = process.env[envHost] || defaultHost;
        url = url.replace(hostString, '://' + host + '/');
    }
    return url;
}

export async function getUrlOrDebug(url:string, urlDebug:string, path:string = 'hello'):Promise<string> {
    if (isDevelopment !== true) return url;
    if (!urlDebug) return url;
    try {
        let orgDebug = urlDebug;
        if (urlDebug.endsWith('/') === false) urlDebug += '/';
        urlDebug = replaceUrlHost(urlDebug, '://centerhost/', centerDebugHost, 'REACT_APP_CENTER_DEBUG_HOST');
        urlDebug = replaceUrlHost(urlDebug, '://usqhost/', usqDebugHost, 'REACT_APP_USQ_DEBUG_HOST');
        urlDebug = replaceUrlHost(urlDebug, '://unitxhost/', usqDebugHost, 'REACT_APP_USQ_DEBUG_HOST');        
        urlDebug = replaceUrlHost(urlDebug, '://usql-server/', debugUsqlServer, 'REACT_APP_DEBUG_USQL_SERVER');

        if (path === undefined) path = '';
        let fetchUrl = urlDebug + path;
        console.log('urlDebug: ' + orgDebug + ' ---- ' + urlDebug + ' === ' + fetchUrl);
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
    catch (error) {
        console.log('cannot connect %s, so use %s', urlDebug, url);
        console.error(error);
        return url;
    }
}
