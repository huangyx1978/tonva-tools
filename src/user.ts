import * as jwtDecode from 'jwt-decode';

export interface User {
    id: number;
    name: string;
    //accesses?: string[];
    token: string;
}

export function decodeToken(token: string): User {
    let ret:any = jwtDecode(token);
    let accesses;
    if (ret.accesses) accesses = ret.accesses.split(',');
    let user: User = {
        id: ret.id,
        name: ret.name,
        // accesses: accesses,
        token: token
    };
    return user;
}
