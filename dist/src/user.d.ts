export interface User {
    id: number;
    name: string;
    token: string;
    device: string;
    nick?: string;
    icon?: string;
}
export declare function decodeToken(token: string): User;
