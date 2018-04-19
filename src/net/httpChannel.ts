//import nav from './nav';
import {bridgeCenterApi, isBridged} from './appBridge';
import {FetchError} from '../fetchError';
import {HttpChannelUI} from './httpChannelUI';

export class HttpChannel {
    private isCenter: boolean;
    private hostUrl: string;
    private apiToken: string;
    private ui?: HttpChannelUI;

    constructor(isCenter: boolean, hostUrl: string, apiToken:string, ui?: HttpChannelUI) {
        this.isCenter = isCenter;
        this.hostUrl = hostUrl;
        this.apiToken = apiToken;
        this.ui = ui;
        this.startWait = this.startWait.bind(this);
        this.endWait = this.endWait.bind(this);
        this.showError = this.showError.bind(this);
    }

    private startWait() {
        if (this.ui !== undefined) this.ui.startWait();
    }

    private endWait() {
        if (this.ui !== undefined) this.ui.endWait();
    }

    private async showError(error:FetchError) {
        if (this.ui !== undefined) await this.ui.showError(error);
    }

    used() {
        this.post('', {});
    }

    get(url: string, params: any = undefined): Promise<any> {
        if (params) {
            let keys = Object.keys(params);
            if (keys.length > 0) {
                let c = '?';
                for (let k of keys) {
                    let v = params[k];
                    if (v === undefined) continue;
                    url += c + k + '=' + params[k];
                    c = '&';
                }
            }
        }
        let options = this.buildOptions();
        options.method = 'GET';
        return this.innerFetch(url, options);
    }

    post(url: string, params: any): Promise<any> {
        let options = this.buildOptions();
        options.method = 'POST';
        options.body = JSON.stringify(params);
        return this.innerFetch(url, options);
    }

    put(url: string, params: any): Promise<any> {
        let options = this.buildOptions();
        options.method = 'PUT';
        options.body = JSON.stringify(params);
        return this.innerFetch(url, options);
    }

    delete(url: string, params: any): Promise<any> {
        let options = this.buildOptions();
        options.method = 'DELETE';
        options.body = JSON.stringify(params);
        return this.innerFetch(url, options);
    }
    async fetch(url: string, options: any, resolve:(value?:any)=>any, reject:(reason?:any)=>void):Promise<void> {
        let that = this;
        this.startWait();
        let path = url;
        console.log('%s %s', options.method, path);
        function buildError(err: string) {
            return {
                channel: that,
                url: path,
                options: options,
                resolve: resolve,
                reject: reject,
                error: err,
            }
        }
        return fetch(path, options)
        .then(async res => {
            that.endWait();
            if (res.ok === false) {
                console.log('call error %s', res.statusText);
                throw res.statusText;
            }
            let ct = res.headers.get('content-type');
            if (ct && ct.indexOf('json')>=0) {
                return res.json().then(async retJson => {
                    if (retJson.ok === true)
                        return resolve(retJson.res);
                    if (retJson.error === undefined) {
                        await that.showError(buildError('not valid tonva json'));
                    }
                    else {
                        await that.showError(buildError(retJson.error));
                        reject(retJson.error);
                    }
                    //throw retJson.error;
                }).catch(async error => {
                    await that.showError(buildError(error.message));
                });
            }
            else {
                return res.text().then(text => resolve(text));
                //.then(text => text);
            }
        })
        .catch(async error => {
            await this.showError(buildError(error.message));
        });
    }

    private innerFetch(url: string, options: any): Promise<any> {
        let u = this.hostUrl + url;
        if (this.isCenter === true && this.apiToken === undefined && isBridged())
            return bridgeCenterApi(u, options.method, options.body);
        return new Promise<any>(async (resolve, reject) => {
            await this.fetch(u, options, resolve, reject);
        });
    }

    callFetch(url:string, method:string, body:any):Promise<any> {
        let options = this.buildOptions();
        options.method = method;
        options.body = body;
        return new Promise<any>(async (resolve, reject) => {
            await this.fetch(url, options, resolve, reject);
        });
    }

    private buildOptions(): any {
        let headers = new Headers();
        headers.append('Access-Control-Allow-Origin', '*');
        headers.append('Content-Type', 'application/json;charset=UTF-8');
        // headers.append('')
        //headers.append('a', 'b');
        if (this.apiToken) { 
            headers.append('Authorization', this.apiToken); 
        }
        let options = {
            headers: headers,
            // cache: 'no-cache',
        };
        return options;
    }
}
