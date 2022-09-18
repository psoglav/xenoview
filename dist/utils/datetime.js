"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toMinutes = exports.getFullTimeFromTimestamp = exports.getTimeFromTimestamp = void 0;
const getTimeFromTimestamp = (ts) => {
    let date = new Date(ts);
    let h = date.getHours().toString().padStart(2, '0');
    let m = date.getMinutes().toString().padStart(2, '0');
    return h + ':' + m;
};
exports.getTimeFromTimestamp = getTimeFromTimestamp;
// TODO: multiply ts by 1000 if needed
const getFullTimeFromTimestamp = (ts) => {
    let date = new Date(ts);
    let y = date.getFullYear().toString().slice(2).padStart(3, `'`);
    let M = date.toLocaleString('en-US', { month: 'short' });
    let d = date.getDate().toString().padStart(2, '0');
    let h = date.getHours().toString().padStart(2, '0');
    let m = date.getMinutes().toString().padStart(2, '0');
    return `${d} ${M} ${y}  ${h}:${m}`;
};
exports.getFullTimeFromTimestamp = getFullTimeFromTimestamp;
const toMinutes = (ts) => {
    let date = new Date(ts);
    return +new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes());
};
exports.toMinutes = toMinutes;
//# sourceMappingURL=datetime.js.map