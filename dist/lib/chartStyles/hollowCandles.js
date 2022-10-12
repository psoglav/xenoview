"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HollowCandles = void 0;
const candles_1 = require("./candles");
class HollowCandles extends candles_1.Candles {
    constructor(chart) {
        super(chart);
        this.bars = true;
        this.empty = true;
    }
    drawCandleBody(left, top, right, bottom, type) {
        var _a;
        this.chart.ctx.beginPath();
        this.chart.ctx.rect(Math.round(left) + 0.5, Math.round(top) + 0.5, Math.round(right) + 1, Math.round(bottom));
        this.chart.ctx.strokeStyle = (_a = this.chart.options.candles) === null || _a === void 0 ? void 0 : _a.colors[type];
        this.chart.ctx.stroke();
        this.chart.ctx.closePath();
    }
}
exports.HollowCandles = HollowCandles;
//# sourceMappingURL=hollowCandles.js.map