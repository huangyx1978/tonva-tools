"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwtDecode = require("jwt-decode");
function decodeToken(token) {
    let ret = jwtDecode(token);
    let accesses;
    if (ret.accesses)
        accesses = ret.accesses.split(',');
    let user = {
        id: ret.id,
        name: ret.name,
        accesses: accesses,
        token: token
    };
    return user;
}
exports.decodeToken = decodeToken;
//# sourceMappingURL=user.js.map