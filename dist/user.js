import jwtDecode from 'jwt-decode';
export function decodeUserToken(token) {
    let ret = jwtDecode(token);
    let user = {
        id: ret.id,
        name: ret.name,
        guest: ret.guest,
        token: token,
    };
    return user;
}
export function decodeGuestToken(token) {
    let ret = jwtDecode(token);
    let guest = {
        id: 0,
        guest: ret.guest,
        token: token,
    };
    return guest;
}
//# sourceMappingURL=user.js.map