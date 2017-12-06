var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class HttpChannel {
    constructor(hostUrl, apiToken, ui) {
        this.hostUrl = hostUrl;
        this.apiToken = apiToken;
        this.ui = ui;
        this.startWait = this.startWait.bind(this);
        this.endWait = this.endWait.bind(this);
        this.showError = this.showError.bind(this);
    }
    startWait() {
        if (this.ui !== undefined)
            this.ui.startWait();
    }
    endWait() {
        if (this.ui !== undefined)
            this.ui.endWait();
    }
    showError(error) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.ui !== undefined)
                yield this.ui.showError(error);
        });
    }
    used() {
        this.post('', {});
    }
    get(url, params = undefined) {
        if (params) {
            let keys = Object.keys(params);
            if (keys.length > 0) {
                let c = '?';
                for (let k of keys) {
                    let v = params[k];
                    if (v === undefined)
                        continue;
                    url += c + k + '=' + params[k];
                    c = '&';
                }
            }
        }
        let options = this.buildOptions();
        options.method = 'GET';
        return this.innerFetch(url, options);
    }
    post(url, params) {
        let options = this.buildOptions();
        options.method = 'POST';
        options.body = JSON.stringify(params);
        return this.innerFetch(url, options);
    }
    put(url, params) {
        let options = this.buildOptions();
        options.method = 'PUT';
        options.body = JSON.stringify(params);
        return this.innerFetch(url, options);
    }
    delete(url, params) {
        let options = this.buildOptions();
        options.method = 'DELETE';
        options.body = JSON.stringify(params);
        return this.innerFetch(url, options);
    }
    fetch(url, options, resolve, reject) {
        return __awaiter(this, void 0, void 0, function* () {
            let that = this;
            this.startWait();
            let path = url;
            console.log('%s %s', options.method, path);
            function buildError(err) {
                return {
                    channel: this,
                    url: path,
                    options: options,
                    resolve: resolve,
                    reject: reject,
                    error: err,
                };
            }
            return fetch(path, options)
                .then((res) => __awaiter(this, void 0, void 0, function* () {
                that.endWait();
                if (res.ok === false) {
                    console.log('call error %s', res.statusText);
                    throw res.statusText;
                }
                let ct = res.headers.get('content-type');
                if (ct && ct.indexOf('json') >= 0) {
                    return res.json().then((retJson) => __awaiter(this, void 0, void 0, function* () {
                        if (retJson.ok === true)
                            return resolve(retJson.res);
                        if (retJson.error === undefined) {
                            yield that.showError(buildError('not valid tonva json'));
                        }
                        else {
                            yield that.showError(buildError(retJson.error));
                            reject(retJson.error);
                        }
                        //throw retJson.error;
                    })).catch((error) => __awaiter(this, void 0, void 0, function* () {
                        yield that.showError(buildError(error.message));
                    }));
                }
                else {
                    return res.text().then(text => resolve(text));
                    //.then(text => text);
                }
            }))
                .catch((error) => __awaiter(this, void 0, void 0, function* () {
                yield this.showError(buildError(error.message));
            }));
        });
    }
    innerFetch(url, options) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () { return yield this.fetch(this.hostUrl + url, options, resolve, reject); }));
    }
    buildOptions() {
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
        };
        return options;
    }
}
//# sourceMappingURL=httpChannel.js.map