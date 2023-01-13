export function getRangeByStep(start, end, step) {
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
    const isFulFilled = end - start > 0 ? (current) => current > intEnd : (current) => current < intEnd;
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
export function getNiceScale(lowerBound, upperBound, maxTicks = 10) {
    let tickSpacing, range, niceLowerBound, niceUpperBound;
    function niceNum(range, round) {
        var exponent = Math.floor(Math.log10(range));
        var fraction = range / Math.pow(10, exponent);
        var niceFraction;
        if (round) {
            if (fraction < 1.5)
                niceFraction = 1;
            else if (fraction < 3)
                niceFraction = 2;
            else if (fraction < 7)
                niceFraction = 5;
            else
                niceFraction = 10;
        }
        else {
            if (fraction <= 1)
                niceFraction = 1;
            else if (fraction <= 2)
                niceFraction = 2;
            else if (fraction <= 5)
                niceFraction = 5;
            else
                niceFraction = 10;
        }
        return niceFraction * Math.pow(10, exponent);
    }
    range = niceNum(upperBound - lowerBound, false);
    tickSpacing = niceNum(range / (maxTicks - 1), true);
    niceLowerBound = Math.floor(lowerBound / tickSpacing) * tickSpacing;
    niceUpperBound = Math.ceil(upperBound / tickSpacing) * tickSpacing;
    return [[niceLowerBound, niceUpperBound], tickSpacing];
}
