
import {setCenterToken} from './usqApi';
import {WSChannel} from './wsChannel';

export const netToken = {
    set(userId:number, token:string) {
        setCenterToken(userId, token);
        WSChannel.setCenterToken(token);
    },
    clear() {
        setCenterToken(0, undefined);
        WSChannel.setCenterToken(undefined);
    }
};
