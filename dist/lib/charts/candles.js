"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandlesChart = void 0;
const chart_1 = require("../core/chart");
class CandlesChart extends chart_1.Chart {
    constructor(container, options) {
        super(container, options);
    }
    draw() {
        this.clear(this.ctx);
        this.clear(this.timeAxis.ctx);
        this.clear(this.priceAxis.ctx);
        if (!this.history) {
            this.loading(true);
        }
        else {
            this.drawGridColumns();
            this.drawGridRows();
            this.timeAxis.update();
            this.priceAxis.update();
            this.drawChart();
            this.pointer.update();
            this.ui.draw();
        }
    }
    drawGridRows() {
        let ctx = this.ctx;
        let rows = this.getGridRows();
        ctx.beginPath();
        ctx.strokeStyle = '#7777aa33';
        for (let i of rows) {
            let y = this.normalizeToY(i);
            this.moveTo(0, y, ctx);
            this.lineTo(this.getWidth(ctx), y, ctx);
        }
        ctx.stroke();
        ctx.closePath();
    }
    drawGridColumns() {
        let ctx = this.ctx;
        let cols = this.getGridColumns();
        ctx.beginPath();
        ctx.strokeStyle = '#7777aa33';
        for (let i of cols) {
            let x = this.getPointX(i);
            this.moveTo(x, 0, ctx);
            this.lineTo(x, this.mainCanvasHeight, ctx);
        }
        ctx.stroke();
        ctx.closePath();
    }
    drawChart() {
        var _a, _b, _c, _d;
        this.getTopHistoryPrice();
        this.getBottomHistoryPrice();
        let data = this.history;
        if (!(data === null || data === void 0 ? void 0 : data.length)) {
            this.log('no history');
            return;
        }
        let ctx = this.ctx;
        this.moveTo(this.boundingRect.left - 10, this.mainCanvasHeight, ctx);
        for (let i = 0; i < data.length; i++) {
            let x = this.boundingRect.left + i * this.pointsGap;
            let halfCandle = this.pointsGap / 4;
            if (x > this.mainCanvasWidth + halfCandle)
                break;
            else if (x < -halfCandle)
                continue;
            let { close, open, low, high } = data[i];
            close = this.normalizeToY(close);
            open = this.normalizeToY(open);
            low = this.normalizeToY(low);
            high = this.normalizeToY(high);
            let candleColor = close > open
                ? (_b = (_a = this.options.candles) === null || _a === void 0 ? void 0 : _a.colors) === null || _b === void 0 ? void 0 : _b.lower
                : (_d = (_c = this.options.candles) === null || _c === void 0 ? void 0 : _c.colors) === null || _d === void 0 ? void 0 : _d.higher;
            ctx.beginPath();
            this.lineTo(x, high, ctx);
            this.lineTo(x, low, ctx);
            ctx.strokeStyle = candleColor;
            ctx.stroke();
            if (halfCandle > 1) {
                this.rect(x - this.pointsGap / 4, open, this.pointsGap / 2, close - open, ctx);
                ctx.fillStyle = candleColor;
                ctx.fill();
            }
            ctx.closePath();
        }
    }
}
exports.CandlesChart = CandlesChart;
//# sourceMappingURL=candles.js.map