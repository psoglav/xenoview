"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeTo = exports.normalize = exports.lerp = void 0;
const lerp = (start, end, t) => {
    return start + (end - start) * t;
};
exports.lerp = lerp;
const normalize = (n, min, max) => (n - min) / (max - min);
exports.normalize = normalize;
const normalizeTo = (from, fromMin, fromMax, toMin, toMax) => (toMax - toMin) * (0, exports.normalize)(from, fromMin, fromMax);
exports.normalizeTo = normalizeTo;
//# sourceMappingURL=math.js.map