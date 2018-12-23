import { Context } from '../context';
import { formRes } from '../formRes';
import { resLang } from '../../VM';
import { nav } from '../../nav';

let res:any;
function getResText(caption: string) {
    if (res === undefined) {
        res = resLang(formRes, nav.language, nav.culture);
    }
    let ret = res[caption];
    return ret || caption;
}

export abstract class Rule {
    abstract check(defy:string[], value:any):void;
}

export type ContextRule = (context:Context)=>{[target:string]:string[]|string} | string[] | string;
export type FieldRule = (value:any) => string[] | string;

export class RuleCustom extends Rule {
    private func: FieldRule;
    constructor(func: FieldRule) {
        super();
        this.func = func;
    }
    check(defy:string[], value:any) {
        let ret = this.func(value);
        if (ret === undefined) return;
        switch (typeof ret) {
            case 'undefined': return;
            case 'string': defy.push(ret); return;
            default: defy.push(...ret); return;
        }        
    }
}

export class RuleRequired extends Rule {
    check(defy:string[], value:any) {
        switch (typeof value) {
            default:
            case 'boolean': return;
            case 'object':
                if (value !== null) return;
                break;
            case 'string':
                if ((value as string).trim().length > 0) return;
                break;
            case 'number':
                if ((value as number) !== NaN) return;
                break;
            case 'undefined':
                break;
        }
        defy.push(getResText('required'));
    }
}

export class RuleNum extends Rule {
    check(defy:string[], value:any) {
        if (value === undefined || value === null) return;
        let n = Number(value);
        if (n === NaN) defy.push(getResText('number'));
    }
}

export class RuleInt extends Rule {
    check(defy:string[], value:any) {
        if (value === undefined || value === null) return;
        let n = Number(value);
        if (Number.isNaN(n) === true || Number.isInteger(n) === false) {
            defy.push(getResText('integer'));
        }
    }
}

export class RuleMin extends RuleNum {
    constructor(min: number) {
        super();
        this.min = min;
    }
    min: number;
    check(defy:string[], value:any) {
        super.check(defy, value);
        if (Number(value) < this.min) defy.push(getResText('min') + this.min);
    }
}

export class RuleMax extends RuleNum {
    constructor(max: number) {
        super();
        this.max = max;
    }
    max: number;
    check(defy:string[], value:any) {
        super.check(defy, value);
        if (Number(value) > this.max) defy.push(getResText('max') + this.max);
    }
}
