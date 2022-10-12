"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Bars = void 0;
const candles_1 = require("./candles");
class Bars extends candles_1.Candles {
    constructor(chart) {
        super(chart);
        this.bars = true;
    }
    drawCandleBody(x, y, width, height) {
        let h = width / 2 - 2;
        this.chart.ctx.beginPath();
        this.chart.moveTo(x - h + 1, y);
        this.chart.lineTo(x + width / 2 + 1, y);
        this.chart.moveTo(x + width / 2 + 1, y + height);
        this.chart.lineTo(x + width + h, y + height);
        this.chart.ctx.stroke();
        this.chart.ctx.closePath();
    }
}
exports.Bars = Bars;
//# sourceMappingURL=bars.js.map