"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Candles = void 0;
const core_1 = require("../core");
class Candles extends core_1.ChartStyle {
    constructor(chart) {
        super(chart);
        this.bars = true;
    }
    draw() {
        this.chart.getTopHistoryPrice();
        this.chart.getBottomHistoryPrice();
        this.drawCandles();
    }
    drawCandles() {
        var _a;
        let data = this.chart.history;
        this.chart.moveTo(this.chart.boundingRect.left - 10, this.chart.mainCanvasHeight);
        for (let i = 0; i < data.length; i++) {
            let x = Math.round(this.chart.boundingRect.left + i * this.chart.pointsGap);
            let halfCandle = this.chart.pointsGap / 4;
            let gap = Math.round(this.chart.pointsGap) + (this.chart.pointsGap % 2);
            if (x > this.chart.mainCanvasWidth + halfCandle)
                break;
            else if (x < -halfCandle)
                continue;
            let { close, open, low, high } = this.chart.normalizePoint(data[i]);
            let color = (_a = this.chart.options.candles) === null || _a === void 0 ? void 0 : _a.colors[close > open ? 'lower' : 'higher'];
            this.chart.ctx.beginPath();
            this.drawCandleStick(x, high, low, color);
            if (halfCandle > 1) {
                this.drawCandleBody(x - gap / 4 - 1, open, gap / 2, close - open, color);
            }
            this.chart.ctx.closePath();
        }
    }
    drawCandleStick(x, top, bottom, color) {
        this.chart.moveTo(x, top);
        this.chart.lineTo(x, bottom);
        this.chart.ctx.strokeStyle = color;
        this.chart.ctx.stroke();
    }
    drawCandleBody(left, top, right, bottom, color) {
        this.chart.rect(left, top, right, bottom);
        this.chart.ctx.fillStyle = color;
        this.chart.ctx.fill();
    }
}
exports.Candles = Candles;
//# sourceMappingURL=candles.js.map