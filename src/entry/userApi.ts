import {CenterApi} from '../net';
import {User, decodeToken} from '../user';
import { nav } from '../ui';

export class UserApi extends CenterApi {
    async login(params: {user: string, pwd: string}): Promise<any> {
        (params as any).device = nav.local.device.get();
        let ret = await this.get('login', params);
        switch (typeof ret) {
            default: return;
            case 'string': return decodeToken(ret);
            case 'object':
                let token = ret.token;
                let user = decodeToken(token);
                let {nick, icon} = ret;
                if (nick) user.nick = nick;
                if (icon) user.icon = icon;
                return user;
        }
        // !== undefined) return decodeToken(token);
    }
    async register(params: {
        nick:string, 
        user:string, 
        pwd:string, 
        country:number, 
        mobile:number, 
        email:string
    }): Promise<any>
    {
        return await this.post('register', params);
    }
}

const userApi = new UserApi('tv/user/', undefined);

export default userApi;
