import { nav } from '../ui/nav';
export class HttpChannelNavUI {
    startWait() {
        nav.startWait();
    }
    endWait() {
        nav.endWait();
    }
    async showError(error) {
        nav.endWait();
        /*
        if (error.name === 'SyntaxError') {
            error = {
                name: error.name,
                message: error.message,
            }
        }*/
        await nav.onError(error);
    }
}
//# sourceMappingURL=httpChannelUI.js.map