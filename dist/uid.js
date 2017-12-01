"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ALPHABET = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const ID_LENGTH = 8;
function uid() {
    let len = ALPHABET.length;
    let rtn = '';
    for (let i = 0; i < ID_LENGTH; i++) {
        rtn += ALPHABET.charAt(Math.floor(Math.random() * len));
    }
    return rtn;
}
exports.uid = uid;
//# sourceMappingURL=uid.js.map