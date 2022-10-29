"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assert = void 0;
function assert(condition, message) {
    if (!condition) {
        throw new Error('Assertion failed' + (message ? ': ' + message : ''));
    }
}
exports.assert = assert;
//# sourceMappingURL=assertions.js.map