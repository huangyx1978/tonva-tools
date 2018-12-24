import { Context } from '../context';
import { FormRes } from '../formRes';
export declare abstract class Rule {
    abstract check(defy: string[], value: any): void;
}
export declare type ContextRule = (context: Context) => {
    [target: string]: string[] | string;
} | string[] | string;
export declare type FieldRule = (value: any) => string[] | string;
export declare class RuleCustom extends Rule {
    private func;
    constructor(func: FieldRule);
    check(defy: string[], value: any): void;
}
export declare abstract class RulePredefined extends Rule {
    protected res: FormRes;
    constructor(res: FormRes);
}
export declare class RuleRequired extends RulePredefined {
    check(defy: string[], value: any): void;
}
export declare class RuleNum extends RulePredefined {
    private minMsg;
    private maxMsg;
    protected min: number;
    protected max: number;
    constructor(res: FormRes, min?: number, max?: number);
    check(defy: string[], value: any): void;
    protected checkMore(defy: string[], value: number): void;
}
export declare class RuleInt extends RuleNum {
    protected checkMore(defy: string[], n: number): void;
}
