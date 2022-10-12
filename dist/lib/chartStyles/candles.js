"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Candles = void 0;
const core_1 = require("../core");
class Candles extends core_1.ChartStyle {
    constructor(chart) {
        super(chart);
        this.bars = true;
        this.empty = false;
    }
    draw() {
        this.chart.getTopHistoryPrice();
        this.chart.getBottomHistoryPrice();
        this.drawCandles();
    }
    drawCandles() {
        let data = this.chart.history;
        for (let i = 0; i < data.length; i++) {
            let x = Math.round(this.chart.boundingRect.left + i * this.chart.pointsGap);
            let halfCandle = this.chart.pointsGap / 4;
            let gap = Math.round(this.chart.pointsGap) + (this.chart.pointsGap % 2);
            if (x > this.chart.mainCanvasWidth + halfCandle)
                break;
            else if (x < -halfCandle)
                continue;
            let { close, open, low, high } = this.chart.normalizePoint(data[i]);
            let type = close > open ? 'lower' : 'higher';
            if (this.empty && halfCandle > 1) {
                this.drawCandleStick(x, high, Math.min(open, close), type);
                this.drawCandleStick(x, Math.max(open, close), low, type);
                this.drawCandleBody(x - gap / 4 - 1, open, gap / 2, close - open, type);
            }
            else {
                this.drawCandleStick(x, high, low, type);
            }
        }
    }
    drawCandleStick(x, top, bottom, type) {
        var _a;
        this.chart.ctx.beginPath();
        this.chart.ctx.moveTo(Math.round(x) + 0.5, top);
        this.chart.ctx.lineTo(Math.round(x) + 0.5, bottom + .5);
        this.chart.ctx.strokeStyle = (_a = this.chart.options.candles) === null || _a === void 0 ? void 0 : _a.colors[type];
        this.chart.ctx.stroke();
        this.chart.ctx.closePath();
    }
    drawCandleBody(x, y, width, height, type) {
        var _a;
        this.chart.ctx.beginPath();
        this.chart.ctx.rect(Math.round(x) + 0.5, Math.round(y) + 0.5, Math.round(width) + 1, Math.round(height));
        this.chart.ctx.fillStyle = (_a = this.chart.options.candles) === null || _a === void 0 ? void 0 : _a.colors[type];
        this.chart.ctx.fill();
        this.chart.ctx.stroke();
        this.chart.ctx.closePath();
    }
}
exports.Candles = Candles;
//# sourceMappingURL=candles.js.map