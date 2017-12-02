"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const net_1 = require("../net");
const user_1 = require("../user");
class UserApi extends net_1.CenterApi {
    login(params) {
        return this.get('login', params)
            .then((token) => {
            if (token !== undefined)
                return user_1.decodeToken(token);
        });
    }
    register(params) {
        return this.post('register', params);
    }
}
exports.UserApi = UserApi;
const userApi = new UserApi('tv/user/');
exports.default = userApi;
//# sourceMappingURL=userApi.js.map