
import {setCenterToken} from './centerApi';
import wsChannel from './wsChannel';

export const netToken = {
    set(token:string) {
        setCenterToken(token);
        wsChannel.setToken(token);
    },
    clear() {
        setCenterToken(undefined);
        wsChannel.setToken(undefined);
    }
};
