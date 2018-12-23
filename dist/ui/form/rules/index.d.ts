import { Context } from '../context';
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
export declare class RuleRequired extends Rule {
    check(defy: string[], value: any): void;
}
export declare class RuleNum extends Rule {
    check(defy: string[], value: any): void;
}
export declare class RuleInt extends Rule {
    check(defy: string[], value: any): void;
}
export declare class RuleMin extends RuleNum {
    constructor(min: number);
    min: number;
    check(defy: string[], value: any): void;
}
export declare class RuleMax extends RuleNum {
    constructor(max: number);
    max: number;
    check(defy: string[], value: any): void;
}
