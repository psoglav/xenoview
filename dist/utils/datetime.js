"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIntervalByDateRange = exports.dateRangeToMilliseconds = exports.unitToMilliseconds = exports.dayOfYear = exports.toMinutes = exports.formatDate = exports.getTimeTickMark = exports.getTimeFromTimestamp = void 0;
const moment_1 = __importDefault(require("moment"));
const getTimeFromTimestamp = (ts) => {
    let date = new Date(ts);
    let h = date.getHours().toString().padStart(2, '0');
    let m = date.getMinutes().toString().padStart(2, '0');
    return h + ':' + m;
};
exports.getTimeFromTimestamp = getTimeFromTimestamp;
const getTimeTickMark = (ts) => {
    let date = (0, moment_1.default)(ts);
    if (date.get('h') == 0) {
        if (date.get('D') == 1) {
            if (date.get('M') == 0)
                return date.get('y').toString();
            return date.format('MMM');
        }
        return date.get('D').toString();
    }
    return date.format('HH:mm');
};
exports.getTimeTickMark = getTimeTickMark;
// TODO: multiply ts by 1000 if needed
const formatDate = (ts) => {
    return (0, moment_1.default)(ts).format('ddd DD MMM \'YY HH:mm');
};
exports.formatDate = formatDate;
const toMinutes = (ts) => {
    if (ts.toString().length != (+new Date()).toString().length)
        ts *= 1000;
    let date = new Date(ts);
    return +new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes());
};
exports.toMinutes = toMinutes;
const dayOfYear = (date) => Math.floor((date - new Date(date.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
exports.dayOfYear = dayOfYear;
const unitToMilliseconds = (value) => {
    let intervalMap = {
        '1s': 1000,
        '1m': 60000,
        '3m': 60000 * 3,
        '5m': 60000 * 5,
        '15m': 60000 * 15,
        '30m': 60000 * 30,
        '1h': 60000 * 60,
        '2h': 60000 * 60 * 2,
        '4h': 60000 * 60 * 4,
        '6h': 60000 * 60 * 6,
        '8h': 60000 * 60 * 8,
        '12h': 60000 * 60 * 12,
        '1d': 60000 * 60 * 24,
        '3d': 60000 * 60 * 24 * 3,
        '1w': 60000 * 60 * 24 * 7,
        '1M': 60000 * 60 * 24 * 30
    };
    return intervalMap[value];
};
exports.unitToMilliseconds = unitToMilliseconds;
// TODO: merge this into unitToMilliseconds
const dateRangeToMilliseconds = (value) => {
    let d = 86400000;
    let dateRangeMap = {
        '1d': d,
        '5d': d * 5,
        '1M': d * 30,
        '3M': d * 30 * 3,
        '6M': d * 30 * 6,
        ytd: d * (0, exports.dayOfYear)(new Date()),
        '1y': d * 365,
        '5y': d * 365 * 5,
        all: undefined
    };
    return dateRangeMap[value];
};
exports.dateRangeToMilliseconds = dateRangeToMilliseconds;
const getIntervalByDateRange = (value) => {
    let map = {
        '1d': '1m',
        '5d': '5m',
        '1M': '30m',
        '3M': '1h',
        '6M': '2h',
        ytd: '1d',
        '1y': '1d',
        '5y': '1w',
        all: '1M'
    };
    return map[value];
};
exports.getIntervalByDateRange = getIntervalByDateRange;
//# sourceMappingURL=datetime.js.map