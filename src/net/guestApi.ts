import { decodeGuestToken } from '../user';
import { CenterApi } from './usqApi';

export class GuestApi extends CenterApi {
    async guest(): Promise<any> {
        //let guest = nav.local.guest.get();
        let ret = await this.get('', {});
        switch (typeof ret) {
            default: return;
            case 'string': return decodeGuestToken(ret);
            case 'object':
                let guest = decodeGuestToken(ret.token);
                return guest;
        }
    }
}

export const guestApi = new GuestApi('tv/guest/', undefined);
