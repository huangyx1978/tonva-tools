import * as jwtDecode from 'jwt-decode';

export interface User {
    id: number;
    name: string;
    token: string;
    device: string;
    nick?: string;
    icon?: string;
}

export function decodeToken(token: string): User {
    let ret:any = jwtDecode(token);
    let accesses;
    if (ret.accesses) accesses = ret.accesses.split(',');

    let user: User = {
        id: ret.id,
        name: ret.name,
        token: token,
        device: ret.device,
    };
    return user;
}
