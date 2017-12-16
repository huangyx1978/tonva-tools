export interface User {
    id: number;
    name: string;
    token: string;
}
export declare function decodeToken(token: string): User;
