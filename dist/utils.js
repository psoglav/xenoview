"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTimeFromTimestamp = exports.lerp = void 0;
const lerp = (start, end, t) => {
    return start + (end - start) * t;
};
exports.lerp = lerp;
const getTimeFromTimestamp = (ts) => {
    let date = new Date(ts);
    let h = date.getHours().toString().padStart(2, "0");
    let m = date.getMinutes().toString().padStart(2, "0");
    return h + ":" + m;
};
exports.getTimeFromTimestamp = getTimeFromTimestamp;
//# sourceMappingURL=utils.js.map