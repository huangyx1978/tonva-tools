import { CenterApi } from '../net';
import { User } from '../user';
export declare class UserApi extends CenterApi {
    login(params: {
        user: string;
        pwd: string;
    }): Promise<User>;
    register(params: {
        nick: string;
        user: string;
        pwd: string;
        country: number;
        mobile: number;
        email: string;
    }): Promise<any>;
}
declare const userApi: UserApi;
export default userApi;
