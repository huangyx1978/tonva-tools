import { CenterApi } from '../net';
import { decodeToken } from '../user';
export class UserApi extends CenterApi {
    login(params) {
        return this.get('login', params)
            .then((token) => {
            if (token !== undefined)
                return decodeToken(token);
        });
    }
    register(params) {
        return this.post('register', params);
    }
}
const userApi = new UserApi('tv/user/', undefined);
export default userApi;
//# sourceMappingURL=userApi.js.map