import {HttpChannel} from './httpChannel';

export async function refetchApi(channel:HttpChannel, url, options, resolve, reject) {
    await channel.fetch(url, options, resolve, reject);
}

export abstract class ApiBase {
    private path: string;
    protected showWaiting: boolean;

    constructor(path: string, showWaiting: boolean) {
        this.path = path || '';
        this.showWaiting = showWaiting;
    }

    protected abstract async getHttpChannel(): Promise<HttpChannel>;

    protected async call(url:string, method:string, body:any):Promise<any> {
        let channel = await this.getHttpChannel();
        return await channel.callFetch(url, method, body);
    }

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

