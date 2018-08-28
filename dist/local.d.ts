import { User } from './user';
export interface ClearableData {
    clear(): void;
}
export declare class Data<T> implements ClearableData {
    private name;
    private value?;
    constructor(name: string);
    get(): T;
    set(value: T): void;
    clear(): void;
}
export declare class LocalData {
    user: Data<User>;
    device: Data<string>;
    homeTabCur: Data<number>;
    logoutClear(): void;
}
//# sourceMappingURL=local.d.ts.map