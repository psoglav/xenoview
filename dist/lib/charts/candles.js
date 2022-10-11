"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Candles = void 0;
const core_1 = require("../core");
class Candles extends core_1.ChartStyle {
    constructor(chart) {
        super(chart);
    }
    draw() {
        var _a, _b, _c, _d;
        this.chart.getTopHistoryPrice();
        this.chart.getBottomHistoryPrice();
        let data = this.chart.history;
        if (!(data === null || data === void 0 ? void 0 : data.length)) {
            this.chart.log('no history');
            return;
        }
        let ctx = this.chart.ctx;
        this.chart.moveTo(this.chart.boundingRect.left - 10, this.chart.mainCanvasHeight, ctx);
        for (let i = 0; i < data.length; i++) {
            let x = this.chart.boundingRect.left + i * this.chart.pointsGap;
            let halfCandle = this.chart.pointsGap / 4;
            if (x > this.chart.mainCanvasWidth + halfCandle)
                break;
            else if (x < -halfCandle)
                continue;
            let { close, open, low, high } = data[i];
            close = this.chart.normalizeToY(close);
            open = this.chart.normalizeToY(open);
            low = this.chart.normalizeToY(low);
            high = this.chart.normalizeToY(high);
            let candleColor = close > open
                ? (_b = (_a = this.chart.options.candles) === null || _a === void 0 ? void 0 : _a.colors) === null || _b === void 0 ? void 0 : _b.lower
                : (_d = (_c = this.chart.options.candles) === null || _c === void 0 ? void 0 : _c.colors) === null || _d === void 0 ? void 0 : _d.higher;
            ctx.beginPath();
            this.chart.lineTo(x, high, ctx);
            this.chart.lineTo(x, low, ctx);
            ctx.strokeStyle = candleColor;
            ctx.stroke();
            if (halfCandle > 1) {
                this.chart.rect(x - this.chart.pointsGap / 4, open, this.chart.pointsGap / 2, close - open, ctx);
                ctx.fillStyle = candleColor;
                ctx.fill();
            }
            ctx.closePath();
        }
    }
}
exports.Candles = Candles;
//# sourceMappingURL=candles.js.map