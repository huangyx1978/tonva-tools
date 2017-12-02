import { setCenterToken } from './centerApi';
import wsChannel from './wsChannel';
export const netToken = {
    set(token) {
        setCenterToken(token);
        wsChannel.setToken(token);
    },
    clear() {
        setCenterToken(undefined);
        wsChannel.setToken(undefined);
    }
};
//# sourceMappingURL=netToken.js.map