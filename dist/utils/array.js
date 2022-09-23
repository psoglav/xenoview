"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.fractureTimes = exports.fracture = exports.rangeByStep = void 0;
function rangeByStep(start, end, step) {
    var _a, _b;
    if (end === start || step === 0) {
        return [start];
    }
    if (step < 0) {
        step = -step;
    }
    const stepNumOfDecimal = ((_a = step.toString().split('.')[1]) === null || _a === void 0 ? void 0 : _a.length) || 0;
    const endNumOfDecimal = ((_b = end.toString().split('.')[1]) === null || _b === void 0 ? void 0 : _b.length) || 0;
    const maxNumOfDecimal = Math.max(stepNumOfDecimal, endNumOfDecimal);
    const power = Math.pow(10, maxNumOfDecimal);
    const increment = end - start > 0 ? step : -step;
    const intEnd = Math.floor(end * power);
    const isFulFilled = end - start > 0
        ? (current) => current > intEnd
        : (current) => current < intEnd;
    const result = [];
    let current = start;
    while (true) {
        result.push(current);
        // to address floating value
        const intValue = Math.floor(current * power) + Math.floor(increment * power);
        current = intValue / power;
        if (isFulFilled(intValue)) {
            break;
        }
    }
    return result;
}
exports.rangeByStep = rangeByStep;
const fracture = (arr) => {
    let result = [...arr];
    if (arr.length == 0) {
        result = [];
    }
    else if (arr.length == 1) {
        let n = arr[0] / 2;
        result = [-n, n];
    }
    else if (arr.length == 2) {
        let [start, end] = arr;
        let max = Math.max(start, end);
        let min = Math.min(start, end);
        let step = (max - min) / 2;
        console.log(step);
        if (step == 0)
            result = [start, start / 2, end];
        else
            result = [start, start + step, end];
    }
    else if (arr.length > 2) {
        let [start, b] = arr;
        let end = arr[arr.length - 1];
        let step = Math.abs(start - b) / 2;
        result = rangeByStep(start, end, step);
    }
    console.log(result);
    return result;
};
exports.fracture = fracture;
const fractureTimes = (arr, n) => {
    let result = [...arr];
    for (let i = 0; i < n; i++) {
        result = (0, exports.fracture)(result);
    }
    return result;
};
exports.fractureTimes = fractureTimes;
//# sourceMappingURL=array.js.map