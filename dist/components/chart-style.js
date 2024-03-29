import { Component } from '../core/component';
export default class ChartStyle extends Component {
    constructor() {
        super();
        this.style = this.chart.options.style;
    }
}
const CachedStyles = {};
const cacheStyle = (style, instance) => {
    let cache = CachedStyles;
    if (!cache[style])
        cache[style] = instance;
    return cache[style];
};
export function createChartStyle(chart) {
    const style = chart.options.style;
    switch (style) {
        case 'candles':
            return cacheStyle(style, new Candles());
        case 'line':
            return cacheStyle(style, new Line());
        case 'area':
            return cacheStyle(style, new Area());
        case 'bars':
            return cacheStyle(style, new Bars());
        case 'hollow-candles':
            return cacheStyle(style, new HollowCandles());
    }
}
export class Line extends ChartStyle {
    constructor() {
        super();
        this.bars = false;
    }
    update(canvas) {
        this.drawLine(canvas);
        this.drawLivePoint(canvas);
    }
    drawLivePoint(canvas) {
        let data = this.chart.history;
        let x = this.chart.boundingRect.left + (data.length - 1) * this.chart.pointsGap;
        let y = this.chart.normalizeToY(data[data.length - 1].close);
        canvas.ctx.fillStyle = this.chart.options.line.color;
        canvas.circle(x, y, 3);
        canvas.ctx.fill();
    }
    drawLine(canvas) {
        let data = this.chart.history;
        canvas.ctx.strokeStyle = this.chart.options.line.color;
        canvas.ctx.lineWidth = this.chart.options.line.width;
        canvas.ctx.lineJoin = 'round';
        canvas.ctx.beginPath();
        for (let i = this.chart.visibleRange()[0]; i < data.length - 1; i++) {
            var x1 = this.chart.getPointX(i);
            var x2 = this.chart.getPointX(i + 1);
            if (x1 > canvas.width)
                break;
            else if (x2 < 0)
                continue;
            let { close: c1 } = data[i];
            let { close: c2 } = data[i + 1];
            c1 = this.chart.normalizeToY(c1);
            c2 = this.chart.normalizeToY(c2);
            canvas.lineTo(x1, c1);
            canvas.lineTo(x2, c2);
        }
        canvas.ctx.stroke();
        canvas.ctx.closePath();
        canvas.ctx.lineWidth = 1;
    }
}
export class Candles extends ChartStyle {
    constructor() {
        super();
        this.bars = true;
        this.empty = false;
    }
    update(canvas) {
        this.drawCandles(canvas);
    }
    drawCandles(canvas) {
        let data = this.chart.history;
        for (let i = this.chart.visibleRange()[0]; i < data.length; i++) {
            let x = Math.round(this.chart.getPointX(i));
            let halfCandle = this.chart.pointsGap / 4;
            let gap = Math.round(this.chart.pointsGap) + (this.chart.pointsGap % 2);
            if (x > canvas.width + halfCandle)
                break;
            else if (x < -halfCandle)
                continue;
            let { close, open, low, high } = this.chart.normalizePoint(data[i]);
            let type = close > open ? 'lower' : 'higher';
            if (this.empty && halfCandle > 1) {
                this.drawCandleStick(x, high, Math.min(open, close), type, canvas);
                this.drawCandleStick(x, Math.max(open, close), low, type, canvas);
                this.drawCandleBody(x - gap / 4 - 1, open, gap / 2, close - open, type, canvas);
            }
            else {
                this.drawCandleStick(x, high, low, type, canvas);
            }
            if (!this.empty && halfCandle > 1) {
                this.drawCandleBody(x - gap / 4 - 1, open, gap / 2, close - open, type, canvas);
            }
        }
    }
    drawCandleStick(x, top, bottom, type, canvas) {
        var _a;
        canvas.ctx.beginPath();
        canvas.ctx.moveTo(Math.round(x) + 0.5, Math.round(top) + 0.5);
        canvas.ctx.lineTo(Math.round(x) + 0.5, Math.round(bottom) + 0.5);
        canvas.ctx.strokeStyle = (_a = this.chart.options.candles) === null || _a === void 0 ? void 0 : _a.colors[type];
        canvas.ctx.stroke();
        canvas.ctx.closePath();
    }
    drawCandleBody(x, y, width, height, type, canvas) {
        var _a;
        canvas.ctx.beginPath();
        canvas.ctx.rect(Math.round(x) + 0.5, Math.round(y) + 0.5, Math.round(width) + 1, Math.round(height));
        canvas.ctx.fillStyle = (_a = this.chart.options.candles) === null || _a === void 0 ? void 0 : _a.colors[type];
        canvas.ctx.fill();
        canvas.ctx.stroke();
        canvas.ctx.closePath();
    }
}
export class Area extends Line {
    constructor() {
        super();
        this.bars = false;
    }
    update(canvas) {
        this.drawArea(canvas);
        this.drawLine(canvas);
        this.drawLivePoint(canvas);
    }
    drawArea(canvas) {
        let data = this.chart.history;
        canvas.ctx.strokeStyle = this.chart.options.line.color;
        canvas.ctx.lineWidth = this.chart.options.line.width;
        let grd = canvas.ctx.createLinearGradient(0, 0, 0, this.chart.chartLayer.height);
        grd.addColorStop(0, this.chart.options.line.color + '55');
        grd.addColorStop(1, this.chart.options.line.color + '07');
        canvas.ctx.beginPath();
        let rangeStart = this.chart.visibleRange()[0];
        canvas.moveTo(this.chart.getPointX(rangeStart), this.chart.chartLayer.height);
        canvas.lineTo(this.chart.getPointX(rangeStart), this.chart.normalizeToY(data[0].close));
        for (let i = rangeStart; i < data.length - 1; i++) {
            var x1 = this.chart.getPointX(i);
            var x2 = this.chart.getPointX(i + 1);
            if (x1 > canvas.width)
                break;
            else if (x2 < 0)
                continue;
            let { close: c1 } = data[i];
            let { close: c2 } = data[i + 1];
            c1 = this.chart.normalizeToY(c1);
            c2 = this.chart.normalizeToY(c2);
            canvas.lineTo(x1, c1);
            canvas.lineTo(x2, c2);
        }
        canvas.lineTo(x2, this.chart.chartLayer.height);
        canvas.ctx.fillStyle = grd;
        canvas.ctx.fill();
        canvas.ctx.closePath();
    }
}
export class Bars extends Candles {
    constructor() {
        super();
        this.bars = true;
    }
    drawCandleBody(x, y, width, height, type, canvas) {
        let h = width / 2 - 2;
        canvas.ctx.beginPath();
        canvas.moveTo(x - h + 1, y);
        canvas.lineTo(x + width / 2 + 1, y);
        canvas.moveTo(x + width / 2 + 1, y + height);
        canvas.lineTo(x + width + h, y + height);
        canvas.ctx.stroke();
        canvas.ctx.closePath();
    }
}
export class HollowCandles extends Candles {
    constructor() {
        super();
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
