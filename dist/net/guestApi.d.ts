import { CenterApi } from './usqApi';
export declare class GuestApi extends CenterApi {
    guest(): Promise<any>;
    unitFromName(unitName: string): Promise<number>;
}
export declare const guestApi: GuestApi;
