export {default as ws} from './wsChannel';
export * from './api';

import {setToken} from './httpChannel';
import wsChannel from './wsChannel';

export const netToken = {
    set(token:string) {
        setToken(token);
        wsChannel.setToken(token);
    },
    clear() {
        setToken(undefined);
        wsChannel.setToken(undefined);
    }
};
