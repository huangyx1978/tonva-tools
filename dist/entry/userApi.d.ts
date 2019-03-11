import { CenterApi } from '../net';
export declare class UserApi extends CenterApi {
    login(params: {
        user: string;
        pwd: string;
        guest: number;
    }): Promise<any>;
    register(params: {
        nick: string;
        user: string;
        pwd: string;
        country: number;
        mobile: number;
        email: string;
        verify: string;
    }): Promise<any>;
    setVerify(account: string, type: 'mobile' | 'email'): Promise<any>;
    checkVerify(account: string, verify: string): Promise<any>;
    isExists(account: string): Promise<any>;
    resetPassword(account: string, password: string, verify: string, type: 'mobile' | 'email'): Promise<any>;
    userSetProp(prop: string, value: any): Promise<void>;
}
declare const userApi: UserApi;
export default userApi;
