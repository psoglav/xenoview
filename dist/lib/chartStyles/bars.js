"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bars = void 0;
const candles_1 = require("./candles");
class Bars extends candles_1.Candles {
    constructor(chart) {
        super(chart);
        this.bars = true;
    }
    drawCandleBody(left, top, right, bottom) {
        let h = right / 2 - 2;
        this.chart.moveTo(left - h + 1, top);
        this.chart.lineTo(left + right / 2 + 1, top);
        this.chart.moveTo(left + right / 2 + 1, top + bottom);
        this.chart.lineTo(left + right + h, top + bottom);
        this.chart.ctx.stroke();
    }
}
exports.Bars = Bars;
//# sourceMappingURL=bars.js.map