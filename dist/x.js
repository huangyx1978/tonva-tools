const arr = [];
export function x(res) {
    //let func = function() {};
    //let pt = func.prototype;
    //let ret = new func();
    arr.push(res);
    return res;
    /*
        $district: undefined,
        $lang: undefined,
        $res: res,
        x: ret,
    //return ret;
    */
}
export function setXLang(appResX, lang, district) {
    for (let rx of arr) {
        rx.$lang = lang;
        rx.$district = district;
        let r = rx;
        if (r === undefined)
            continue;
        mergeProps(rx, r);
        let r$ = r.x;
        if (r$ !== undefined)
            mergeProps(rx.x, r$);
        let l = r[lang];
        if (l === undefined)
            continue;
        mergeProps(rx, l);
        let l$ = l.x;
        if (l$ !== undefined)
            mergeProps(rx.x, l$);
        let d = l[district];
        if (d === undefined)
            continue;
        mergeProps(rx, d);
        let d$ = d.x;
        if (d$ !== undefined)
            mergeProps(rx.x, d$);
        let s = null;
    }
}
function mergeProps(to, src) {
    let prototype = buildPrototype(src);
    Object.setPrototypeOf(to, prototype);
}
function buildPrototype(src) {
    if (typeof src !== 'object')
        return src;
    let pt = {};
    for (let i in src) {
        let obj = buildPrototype(src[i]);
        Object.defineProperty(pt, i, {
            enumerable: true,
            get: function () {
                /*
                if (typeof obj === 'function') {
                    debugger;
                    return obj();
                }*/
                return obj;
            }
        });
    }
    return pt;
}
const zero = '00000000000000';
export function left0(num, fix) {
    if (num === undefined)
        return '';
    let r = num.toString();
    let len = fix - r.length;
    if (len <= 0)
        return r;
    return zero.substr(0, len) + r;
}
//# sourceMappingURL=x.js.map