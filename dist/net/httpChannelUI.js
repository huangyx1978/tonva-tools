"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const nav_1 = require("../ui/nav");
class HttpChannelNavUI {
    startWait() {
        nav_1.nav.startWait();
    }
    endWait() {
        nav_1.nav.endWait();
    }
    showError(error) {
        return __awaiter(this, void 0, void 0, function* () {
            nav_1.nav.endWait();
            /*
            if (error.name === 'SyntaxError') {
                error = {
                    name: error.name,
                    message: error.message,
                }
            }*/
            yield nav_1.nav.onError(error);
        });
    }
}
exports.HttpChannelNavUI = HttpChannelNavUI;
//# sourceMappingURL=httpChannelUI.js.map