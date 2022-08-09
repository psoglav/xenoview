"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFullTimeFromTimestamp = exports.getTimeFromTimestamp = exports.lerp = void 0;
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
const getFullTimeFromTimestamp = (ts) => {
    let date = new Date(ts);
    let y = date.getFullYear().toString().slice(2).padStart(3, `'`);
    let M = date.toLocaleString("en-US", { month: "short" });
    let d = date.getDate().toString().padStart(2, "0");
    let h = date.getHours().toString().padStart(2, "0");
    let m = date.getMinutes().toString().padStart(2, "0");
    return `${d} ${M} ${y}  ${h}:${m}`;
};
exports.getFullTimeFromTimestamp = getFullTimeFromTimestamp;
//# sourceMappingURL=utils.js.map