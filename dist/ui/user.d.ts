export interface User {
    id: number;
    name: string;
    accesses?: string[];
    token: string;
}
export declare function decodeToken(token: string): User;
