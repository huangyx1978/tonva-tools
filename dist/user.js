import * as jwtDecode from 'jwt-decode';
export function decodeToken(token) {
    let ret = jwtDecode(token);
    let accesses;
    if (ret.accesses)
        accesses = ret.accesses.split(',');
    let user = {
        id: ret.id,
        name: ret.name,
        token: token,
        device: ret.device,
    };
    return user;
}
//# sourceMappingURL=user.js.map