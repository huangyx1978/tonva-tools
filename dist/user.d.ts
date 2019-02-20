export interface Unit {
    id: number;
    name: string;
}
export interface Guest {
    id: number;
    guest: number;
    token: string;
}
export interface User extends Guest {
    id: number;
    name: string;
    nick?: string;
    icon?: string;
}
export declare function decodeUserToken(token: string): User;
export declare function decodeGuestToken(token: string): Guest;
