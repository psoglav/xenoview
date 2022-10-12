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
    drawCandleBody(x, y, width, height, type) {
        var _a;
        this.chart.ctx.beginPath();
        this.chart.ctx.rect(Math.round(x) + 0.5, Math.round(y) + 0.5, Math.round(width) + 1, Math.round(height));
        this.chart.ctx.strokeStyle = (_a = this.chart.options.candles) === null || _a === void 0 ? void 0 : _a.colors[type];
        this.chart.ctx.stroke();
        this.chart.ctx.closePath();
    }
}
exports.HollowCandles = HollowCandles;
//# sourceMappingURL=hollowCandles.js.map