import {HttpChannel} from './httpChannel';

export async function refetchApi(channel:HttpChannel, url, options, resolve, reject) {
    await channel.fetch(url, options, resolve, reject);
}

export abstract class ApiBase {
    //ws: string;
    protected token: string;
    protected path: string;
    protected showWaiting: boolean;

    constructor(path: string, /*ws:string, */showWaiting: boolean) {
        //this.ws = ws;
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
    if (urlDebug === undefined ||
        document.location.hostname !== 'localhost')
    {
        return url;
    }

    try {
        let ret = await fetch(urlDebug + 'hello', {
            method: "GET",
            mode: "no-cors", // no-cors, cors, *same-origin
            headers: {
                "Content-Type": "text/plain"
            },
        });
        return urlDebug;
    }
    catch {
        console.log('cannot connect %s, so use %s', urlDebug, url);
        return url;
    }
    /*
    if (process.env.NODE_ENV==='development') {
        if (urlDebug !== undefined) url = urlDebug;
        //if (wsDebug !== undefined) ws = wsDebug;
    }
    //this.ws = ws;
    */
}
