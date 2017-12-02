"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const centerApi_1 = require("./centerApi");
const wsChannel_1 = require("./wsChannel");
exports.netToken = {
    set(token) {
        centerApi_1.setCenterToken(token);
        wsChannel_1.default.setToken(token);
    },
    clear() {
        centerApi_1.setCenterToken(undefined);
        wsChannel_1.default.setToken(undefined);
    }
};
//# sourceMappingURL=netToken.js.map