"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
var wsChannel_1 = require("./wsChannel");
exports.ws = wsChannel_1.default;
__export(require("./api"));
const httpChannel_1 = require("./httpChannel");
const wsChannel_2 = require("./wsChannel");
exports.netToken = {
    set(token) {
        httpChannel_1.setToken(token);
        wsChannel_2.default.setToken(token);
    },
    clear() {
        httpChannel_1.setToken(undefined);
        wsChannel_2.default.setToken(undefined);
    }
};
//# sourceMappingURL=index.js.map