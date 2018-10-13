import { centerDebugHost } from './centerDebugHost';
import { fetchLocalCheck } from './fetchLocalCheck';
export async function refetchApi(channel, url, options, resolve, reject) {
    await channel.fetch(url, options, resolve, reject);
}
export class ApiBase {
    constructor(path, showWaiting) {
        this.path = path || '';
        this.showWaiting = showWaiting;
    }
    async call(url, method, body) {
        let channel = await this.getHttpChannel();
        return await channel.callFetch(url, method, body);
    }
    async get(path, params) {
        let channel = await this.getHttpChannel();
        return await channel.get(this.path + path, params);
    }
    async post(path, params) {
        let channel = await this.getHttpChannel();
        return await channel.post(this.path + path, params);
    }
    async put(path, params) {
        let channel = await this.getHttpChannel();
        return await channel.put(this.path + path, params);
    }
    async delete(path, params) {
        let channel = await this.getHttpChannel();
        return await channel.delete(this.path + path, params);
    }
}
export async function getUrlOrDebug(url, urlDebug) {
    try {
        if (urlDebug.endsWith('/') === false)
            urlDebug += '/';
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
            mode: "no-cors",
            headers: {
                "Content-Type": "text/plain"
            },
        };
        let ret = await fetchLocalCheck(fetchUrl, fetchOptions);
        let text = await ret.text();
        return urlDebug;
    }
    catch (_a) {
        console.log('cannot connect %s, so use %s', urlDebug, url);
        return url;
    }
}
//# sourceMappingURL=apiBase.js.map