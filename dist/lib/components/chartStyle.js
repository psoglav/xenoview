"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HollowCandles = exports.Bars = exports.Area = exports.Candles = exports.Line = exports.createChartStyle = void 0;
const component_1 = require("../core/component");
class ChartStyle extends component_1.Component {
    constructor(chart) {
        super(chart);
        this.style = chart.options.style;
    }
}
exports.default = ChartStyle;
const CachedStyles = {};
const cacheStyle = (style, instance) => {
    let cache = CachedStyles;
    if (!cache[style])
        cache[style] = instance;
    return cache[style];
};
function createChartStyle(chart) {
    const style = chart.options.style;
    switch (style) {
        case 'candles':
            return cacheStyle(style, new Candles(chart));
        case 'line':
            return cacheStyle(style, new Line(chart));
        case 'area':
            return cacheStyle(style, new Area(chart));
        case 'bars':
            return cacheStyle(style, new Bars(chart));
        case 'hollow-candles':
            return cacheStyle(style, new HollowCandles(chart));
    }
}
exports.createChartStyle = createChartStyle;
class Line extends ChartStyle {
    constructor(chart) {
        super(chart);
        this.bars = false;
    }
    update() {
        this.drawLine();
        this.drawLivePoint();
    }
    drawLivePoint() {
        let data = this.chart.history;
        let x = this.chart.boundingRect.left + (data.length - 1) * this.chart.pointsGap;
        let y = this.chart.normalizeToY(data[data.length - 1].close);
        this.chart.ctx.fillStyle = this.chart.options.line.color;
        this.chart.circle(x, y, 3);
        this.chart.ctx.fill();
    }
    drawLine() {
        let data = this.chart.history;
        let ctx = this.chart.ctx;
        ctx.strokeStyle = this.chart.options.line.color;
        ctx.lineWidth = this.chart.options.line.width;
        ctx.lineJoin = 'round';
        ctx.beginPath();
        for (let i = this.chart.visibleRange[0]; i < data.length - 1; i++) {
            var x1 = this.chart.getPointX(i);
            var x2 = this.chart.getPointX(i + 1);
            if (x1 > this.chart.mainCanvasWidth)
                break;
            else if (x2 < 0)
                continue;
            let { close: c1 } = data[i];
            let { close: c2 } = data[i + 1];
            c1 = this.chart.normalizeToY(c1);
            c2 = this.chart.normalizeToY(c2);
            this.chart.lineTo(x1, c1);
            this.chart.lineTo(x2, c2);
        }
        ctx.stroke();
        ctx.closePath();
        ctx.lineWidth = 1;
    }
}
exports.Line = Line;
class Candles extends ChartStyle {
    constructor(chart) {
        super(chart);
        this.bars = true;
        this.empty = false;
    }
    update() {
        this.drawCandles();
    }
    drawCandles() {
        let data = this.chart.history;
        for (let i = this.chart.visibleRange[0]; i < data.length; i++) {
            let x = Math.round(this.chart.getPointX(i));
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
            if (!this.empty && halfCandle > 1) {
                this.drawCandleBody(x - gap / 4 - 1, open, gap / 2, close - open, type);
            }
        }
    }
    drawCandleStick(x, top, bottom, type) {
        var _a;
        this.chart.ctx.beginPath();
        this.chart.ctx.moveTo(Math.round(x) + 0.5, Math.round(top) + 0.5);
        this.chart.ctx.lineTo(Math.round(x) + 0.5, Math.round(bottom) + 0.5);
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
class Area extends Line {
    constructor(chart) {
        super(chart);
        this.bars = false;
    }
    update() {
        this.drawArea();
        this.drawLine();
        this.drawLivePoint();
    }
    drawArea() {
        let data = this.chart.history;
        let ctx = this.chart.ctx;
        ctx.strokeStyle = this.chart.options.line.color;
        ctx.lineWidth = this.chart.options.line.width;
        let grd = ctx.createLinearGradient(0, 0, 0, this.chart.mainCanvasHeight);
        grd.addColorStop(0, this.chart.options.line.color + '55');
        grd.addColorStop(1, this.chart.options.line.color + '07');
        ctx.beginPath();
        let rangeStart = this.chart.visibleRange[0];
        this.chart.moveTo(this.chart.getPointX(rangeStart), this.chart.mainCanvasHeight);
        this.chart.lineTo(this.chart.getPointX(rangeStart), this.chart.normalizeToY(data[0].close));
        for (let i = rangeStart; i < data.length - 1; i++) {
            var x1 = this.chart.getPointX(i);
            var x2 = this.chart.getPointX(i + 1);
            if (x1 > this.chart.mainCanvasWidth)
                break;
            else if (x2 < 0)
                continue;
            let { close: c1 } = data[i];
            let { close: c2 } = data[i + 1];
            c1 = this.chart.normalizeToY(c1);
            c2 = this.chart.normalizeToY(c2);
            this.chart.lineTo(x1, c1);
            this.chart.lineTo(x2, c2);
        }
        this.chart.lineTo(x2, this.chart.mainCanvasHeight);
        ctx.fillStyle = grd;
        ctx.fill();
        ctx.closePath();
    }
}
exports.Area = Area;
class Bars extends Candles {
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
class HollowCandles extends Candles {
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
//# sourceMappingURL=chartStyle.js.map