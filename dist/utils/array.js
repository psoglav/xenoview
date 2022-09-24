"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rangeByStep = void 0;
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
//# sourceMappingURL=array.js.map