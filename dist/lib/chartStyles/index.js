"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createChartStyle = void 0;
__exportStar(require("./candles"), exports);
__exportStar(require("./line"), exports);
__exportStar(require("./area"), exports);
const _1 = require(".");
function createChartStyle(chart) {
    switch (chart.options.style) {
        case 'candles':
            return new _1.Candles(chart);
        case 'line':
            return new _1.Line(chart);
        case 'area':
            return new _1.Area(chart);
    }
}
exports.createChartStyle = createChartStyle;
//# sourceMappingURL=index.js.map