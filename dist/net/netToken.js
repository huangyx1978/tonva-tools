import { setCenterToken } from './usqApi';
import { WSChannel } from './wsChannel';
export const netToken = {
    set(userId, token) {
        setCenterToken(userId, token);
        WSChannel.setCenterToken(token);
    },
    clear() {
        setCenterToken(0, undefined);
        WSChannel.setCenterToken(undefined);
    }
};
//# sourceMappingURL=netToken.js.map