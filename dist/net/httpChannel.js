"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apiHost = process.env.REACT_APP_APIHOST;
let token = undefined;
function setToken(t) {
    token = t;
}
exports.setToken = setToken;
class HttpChannel {
    constructor(ui) {
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
        if (this.ui !== undefined)
            this.ui.showError(error);
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
        let that = this;
        this.startWait();
        let path = url;
        console.log('%s %s', options.method, path);
        function buildError(err) {
            return {
                url: path,
                options: options,
                resolve: resolve,
                reject: reject,
                error: err,
            };
        }
        return fetch(path, options)
            .then(res => {
            that.endWait();
            if (res.ok === false) {
                throw res.statusText;
            }
            let ct = res.headers.get('content-type');
            if (ct && ct.indexOf('json') >= 0) {
                return res.json().then(retJson => {
                    if (retJson.ok === true)
                        return resolve(retJson.res);
                    if (retJson.error === undefined) {
                        that.showError(buildError('not valid tonva json'));
                    }
                    else {
                        that.showError(buildError(retJson.error));
                        reject(retJson.error);
                    }
                    //throw retJson.error;
                }).catch(error => {
                    that.showError(buildError(error.message));
                });
            }
            else {
                return res.text().then(text => resolve(text));
                //.then(text => text);
            }
        })
            .catch(error => {
            this.showError(buildError(error.message));
        });
    }
    innerFetch(url, options) {
        return new Promise((resolve, reject) => this.fetch(apiHost + url, options, resolve, reject));
    }
    buildOptions() {
        let headers = new Headers();
        headers.append('Access-Control-Allow-Origin', '*');
        headers.append('Content-Type', 'application/json;charset=UTF-8');
        // headers.append('')
        //headers.append('a', 'b');
        if (token) {
            headers.append('Authorization', token);
        }
        let options = {
            headers: headers,
        };
        return options;
    }
}
exports.HttpChannel = HttpChannel;
//# sourceMappingURL=httpChannel.js.map