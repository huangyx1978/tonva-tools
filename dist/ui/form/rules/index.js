import { formRes } from '../formRes';
import { resLang } from '../../VM';
import { nav } from '../../nav';
let res;
function getResText(caption) {
    if (res === undefined) {
        res = resLang(formRes, nav.language, nav.culture);
    }
    let ret = res[caption];
    return ret || caption;
}
export class Rule {
}
export class RuleCustom extends Rule {
    constructor(func) {
        super();
        this.func = func;
    }
    check(defy, value) {
        let ret = this.func(value);
        if (ret === undefined)
            return;
        switch (typeof ret) {
            case 'undefined': return;
            case 'string':
                defy.push(ret);
                return;
            default:
                defy.push(...ret);
                return;
        }
    }
}
export class RuleRequired extends Rule {
    check(defy, value) {
        switch (typeof value) {
            default:
            case 'boolean': return;
            case 'object':
                if (value !== null)
                    return;
                break;
            case 'string':
                if (value.trim().length > 0)
                    return;
                break;
            case 'number':
                if (value !== NaN)
                    return;
                break;
            case 'undefined':
                break;
        }
        defy.push(getResText('required'));
    }
}
export class RuleNum extends Rule {
    check(defy, value) {
        if (value === undefined || value === null)
            return;
        let n = Number(value);
        if (n === NaN)
            defy.push(getResText('number'));
    }
}
export class RuleInt extends Rule {
    check(defy, value) {
        if (value === undefined || value === null)
            return;
        let n = Number(value);
        if (Number.isNaN(n) === true || Number.isInteger(n) === false) {
            defy.push(getResText('integer'));
        }
    }
}
export class RuleMin extends RuleNum {
    constructor(min) {
        super();
        this.min = min;
    }
    check(defy, value) {
        super.check(defy, value);
        if (Number(value) < this.min)
            defy.push(getResText('min') + this.min);
    }
}
export class RuleMax extends RuleNum {
    constructor(max) {
        super();
        this.max = max;
    }
    check(defy, value) {
        super.check(defy, value);
        if (Number(value) > this.max)
            defy.push(getResText('max') + this.max);
    }
}
//# sourceMappingURL=index.js.map