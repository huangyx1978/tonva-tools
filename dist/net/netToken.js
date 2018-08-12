import { setCenterToken } from './api';
import { WSChannel } from './wsChannel';
export const netToken = {
    set(token) {
        setCenterToken(token);
        WSChannel.setCenterToken(token);
    },
    clear() {
        setCenterToken(undefined);
        WSChannel.setCenterToken(undefined);
    }
};
//# sourceMappingURL=netToken.js.map