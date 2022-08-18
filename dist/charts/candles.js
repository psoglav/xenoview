"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandlesChart = void 0;
const utils_1 = require("../utils");
const base_1 = __importDefault(require("./base"));
class CandlesChart extends base_1.default {
    constructor(container, options) {
        super(container, options);
        this.pointerYPosIndex = 4;
        this.pointerIsVisible = false;
        this.panningIsActive = false;
        this.candlesSpace = 0;
        this.isZoomingYAxis = false;
        this.isZoomingXAxis = false;
    }
    draw() {
        this.clear(this.chartContext);
        this.clear(this.xAxisContext);
        this.clear(this.yAxisContext);
        if (this.chartData) {
            this.drawGridColumns();
            this.drawGridRows();
            this.drawXAxisLabels();
            this.drawYAxisLabels();
            // this.drawYAxis()
        }
        if (this.pointerIsVisible) {
            this.drawTimeMarker();
            this.drawPriceMarker();
        }
        this.drawChart();
        this.drawPointer();
        this.drawCurrentMarketPriceMarker();
        this.drawTopLabels();
        this.mainDebug();
    }
    zoomChart(side) {
        let zoomPoint = this.mainCanvasWidth;
        let d = 20 / this.zoomSpeed;
        this.position.right += ((this.position.right - zoomPoint) / d) * side;
        this.position.left += ((this.position.left - zoomPoint) / d) * side;
        this.clampXPanning();
        this.filterVisiblePointsAndCache();
    }
    moveChart(movement) {
        if (this.position.right == this.mainCanvasWidth - 200 && movement < 0)
            return;
        if (this.position.left == 0 && movement > 0)
            return;
        this.position.left += movement;
        this.position.right += movement;
        this.clampXPanning();
    }
    clampXPanning() {
        if (this.position.left > 0)
            this.position.left = 0;
        if (this.position.right < this.mainCanvasWidth - 200)
            this.position.right = this.mainCanvasWidth - 200;
    }
    movePointer() {
        let data = this.chartData;
        if (!(data === null || data === void 0 ? void 0 : data.length))
            return;
        let x = this.mousePosition.x - this.canvasRect.x;
        x = ((x - this.position.left) / this.chartFullWidth) * data.length;
        let i = Math.round(x);
        this.pointerYPosIndex =
            i > data.length - 1 ? data.length - 1 : i < 0 ? 0 : i;
    }
    drawPointer() {
        var _a;
        if (!((_a = this.chartData) === null || _a === void 0 ? void 0 : _a.length) || !this.pointerIsVisible)
            return;
        let ctx = this.chartContext;
        let x = this.position.left + this.candlesSpace * this.pointerYPosIndex;
        let y = this.mousePosition.y;
        ctx.strokeStyle = this.options.pointer.fgColor;
        ctx.setLineDash([5, 4]);
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, this.mainCanvasHeight);
        ctx.moveTo(0, y - this.canvasRect.top);
        ctx.lineTo(this.mainCanvasWidth, y - this.canvasRect.top);
        ctx.closePath();
        ctx.stroke();
        ctx.setLineDash([]);
    }
    drawCurrentMarketPriceMarker() {
        let ctx = this.chartContext;
        let data = this.history;
        if (!data || !data.length)
            return;
        let point = data[data.length - 1];
        let npoint = this.normalizePoint(point);
        let y = npoint.close;
        let type = npoint.close < npoint.open ? 'higher' : 'lower';
        ctx.strokeStyle = this.options.candles.colors[type];
        ctx.setLineDash([1, 2]);
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(this.mainCanvasWidth, y);
        ctx.closePath();
        ctx.stroke();
        ctx.setLineDash([]);
        ctx = this.yAxisContext;
        ctx.beginPath();
        ctx.fillStyle = this.options.candles.colors[type];
        this.rect(0, y - 10, this.getWidth(ctx), 20, ctx);
        ctx.fill();
        ctx.closePath();
        ctx.fillStyle = 'white';
        ctx.font = '11px Verdana';
        ctx.fillText(point.close.toFixed(2), 10, y + 5.5);
    }
    drawPriceMarker() {
        let ctx = this.yAxisContext;
        let y = this.mousePosition.y - this.canvasRect.top;
        let h = this.mainCanvasHeight;
        let t = this.topHistoryPrice[1];
        let b = this.bottomHistoryPrice[1];
        let price = (y / h) * (b - t) + t;
        ctx.beginPath();
        ctx.fillStyle = this.options.pointer.bgColor;
        this.rect(0, y - 10, this.getWidth(ctx), 20, ctx);
        ctx.fill();
        ctx.closePath();
        ctx.fillStyle = 'white';
        ctx.font = '11px Verdana';
        ctx.fillText(price.toFixed(2), 10, y + 5.5);
    }
    drawTimeMarker() {
        let ctx = this.xAxisContext;
        let data = this.history;
        let h = this.getHeight(ctx);
        let x = this.mousePosition.x - this.canvasRect.x;
        let i = Math.round(((x - this.position.left) / this.chartFullWidth) * data.length);
        let point = data[i];
        if (!point)
            return;
        if (point.time.toString().length != 13)
            point.time *= 1000;
        let time = (0, utils_1.getFullTimeFromTimestamp)(point.time);
        x = this.getPointX(i);
        ctx.beginPath();
        ctx.fillStyle = this.options.pointer.bgColor;
        this.rect(x - 60, 0, 118, h, ctx);
        ctx.fill();
        ctx.closePath();
        ctx.fillStyle = 'white';
        ctx.font = '11px Verdana';
        ctx.fillText(time, x - 50, 20);
    }
    // TODO: move these two functions to separate UI class
    drawTopLabels() {
        var _a;
        if (!this.ticker)
            return;
        let ctx = this.chartContext;
        ctx.font = '18px Arial';
        let y = 30;
        let x = 20;
        ctx.fillStyle = (_a = this.options) === null || _a === void 0 ? void 0 : _a.textColor;
        let currency = this.ticker.currency;
        ctx.fillText(currency + ' / TetherUS - BINANCE - CryptoView', x, y);
        this.drawCandleDataLabels(x + 380 + currency.length * 5, y);
    }
    drawCandleDataLabels(x, y) {
        var _a, _b, _c;
        let hist = this.history;
        let ctx = this.chartContext;
        let i = this.pointerIsVisible ? this.pointerYPosIndex : hist.length - 1;
        let point = {
            O: hist[i].open,
            H: hist[i].high,
            L: hist[i].low,
            C: hist[i].close,
        };
        let res = '';
        let gap = 8.5;
        ctx.font = '15px Arial';
        for (let k = 0; k < 4; k++) {
            let [key, value] = Object.entries(point)[k];
            res += key + value + '  ';
        }
        for (let i = 0; i < res.length; i++) {
            let s = res[i];
            let xx = i * gap + x;
            let isKey = Object.keys(point).includes(s);
            if (isKey) {
                ctx.fillStyle = (_a = this.options) === null || _a === void 0 ? void 0 : _a.textColor;
                xx -= 4;
            }
            else {
                let { higher, lower } = (_c = (_b = this.options) === null || _b === void 0 ? void 0 : _b.candles) === null || _c === void 0 ? void 0 : _c.colors;
                ctx.fillStyle = point.C > point.O ? higher : lower;
            }
            ctx.fillText(s, xx, y);
        }
    }
    mainDebug() {
        // this.debug(, 10, 300)
    }
    getGridRows() {
        let t = this.topHistoryPrice[1];
        let b = this.bottomHistoryPrice[1];
        if (t == 0 && b == 0)
            return [];
        t = Math.floor(t / 10) * 10;
        b = Math.floor(b / 10) * 10;
        let delta = t - b;
        let result = [];
        let length = delta / 10;
        let start = 0;
        let end = length;
        let step = 1;
        while (this.normalizeY((start / length) * delta + b) <
            this.getWidth(this.chartContext)) {
            start -= step;
            step += 5;
            if (start < -5000)
                break;
        }
        step = 0;
        while (this.normalizeY((end / length) * delta + b) > 0) {
            end += step;
            step += 5;
            if (end > 5000)
                break;
        }
        for (let i = start; i <= end; i++) {
            result.push((i / length) * delta + b);
        }
        let prev = 0;
        return result.filter((i) => {
            let y = this.normalizeY(i);
            let py = this.normalizeY(prev);
            if (py - y < 30 && y != py) {
                return 0;
            }
            prev = i;
            return 1;
        });
    }
    getGridColumns() {
        let prev = 0;
        return this.history
            .map((_, i) => i)
            .filter((i) => {
            let x = this.getPointX(i);
            let px = this.getPointX(prev);
            if (x - px < 100 && x != px) {
                return 0;
            }
            prev = i;
            return 1;
        });
    }
    drawGridRows() {
        let ctx = this.chartContext;
        let rows = this.getGridRows();
        ctx.beginPath();
        ctx.strokeStyle = '#7777aa33';
        for (let i of rows) {
            let y = this.normalizeY(i);
            this.moveTo(0, y, ctx);
            this.lineTo(this.getWidth(ctx), y, ctx);
        }
        ctx.stroke();
        ctx.closePath();
    }
    drawGridColumns() {
        let ctx = this.chartContext;
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
    drawYAxisLabels() {
        let ctx = this.yAxisContext;
        let rows = this.getGridRows();
        for (let i of rows) {
            let y = this.normalizeY(i);
            this.moveTo(0, y, ctx);
            this.lineTo(this.getWidth(ctx), y, ctx);
            let fz = 11;
            ctx.fillStyle = this.options.textColor;
            ctx.font = fz + 'px Verdana';
            ctx.fillText(i.toFixed(2), 10, y - 2 + fz / 2);
        }
    }
    drawXAxisLabels() {
        var _a, _b;
        let ctx = this.xAxisContext;
        let cols = this.getGridColumns();
        this.clear(ctx);
        ctx.beginPath();
        let size = ((_b = (_a = this.options.xAxis) === null || _a === void 0 ? void 0 : _a.labels) === null || _b === void 0 ? void 0 : _b.fontSize) || 11;
        ctx.fillStyle = this.options.textColor;
        ctx.font = size + 'px Verdana';
        for (let i of cols) {
            let point = this.history[i];
            let x = this.getPointX(i);
            let time = (0, utils_1.getTimeFromTimestamp)(point.time * 1000);
            ctx.fillText(time, x - 16, 16);
        }
        ctx.stroke();
        ctx.closePath();
    }
    drawYAxis() {
        let ctx = this.chartContext;
        let yAxisCtx = this.yAxisContext;
        let segments = 20, h = this.mainCanvasHeight, w = this.mainCanvasWidth;
        let t = this.topHistoryPrice[1];
        let b = this.bottomHistoryPrice[1];
        let r = 1, tr = 0, br = 0;
        let round = (n) => Math.round(n / r) * r;
        while (tr == br) {
            tr = round(t);
            br = round(b);
            if (tr == br)
                r += 10;
        }
        let normalize = (y) => ((y - br) / (tr - br)) * h;
        let reverse = (y) => h - y;
        let convert = (y) => reverse(normalize(y));
        this.clear(yAxisCtx);
        ctx.beginPath();
        ctx.strokeStyle = '#7777aa33';
        tr = convert(tr);
        br = convert(br);
        let hh = Math.abs((tr - br) / 2);
        let k = Math.abs(this.yZoomFactor);
        tr = (tr - hh) / k + hh;
        br = (br - hh) / k + hh;
        let step = (tr - br) / segments;
        while (step > -30) {
            segments -= segments / 5;
            step = (tr - br) / segments;
        }
        while (step < -80) {
            segments += segments / 5;
            step = (tr - br) / segments;
        }
        let segmentsOut = 0;
        while (tr > segmentsOut * Math.abs(step)) {
            segmentsOut++;
        }
        for (let i = segments + segmentsOut; i >= -segmentsOut; i--) {
            let y = i * step;
            this.moveTo(0, y + br, ctx);
            this.lineTo(w, y + br, ctx);
            let fz = 11;
            yAxisCtx.fillStyle = this.options.textColor;
            yAxisCtx.font = fz + 'px Verdana';
            let price = i * ((t - b) / segments);
            yAxisCtx.fillText(round(price + b).toFixed(2), 10, y + br - 2 + fz / 2);
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
        let ctx = this.chartContext;
        this.moveTo(this.position.left - 10, this.mainCanvasHeight, ctx);
        for (let i = 0; i < data.length; i++) {
            this.candlesSpace = this.chartFullWidth / data.length;
            let x = this.position.left + i * this.candlesSpace;
            let halfCandle = this.candlesSpace / 4;
            if (x > this.mainCanvasWidth + halfCandle)
                break;
            else if (x < -halfCandle)
                continue;
            let { close, open, low, high } = this.normalizePoint(data[i]);
            let candleColor = close > open
                ? (_b = (_a = this.options.candles) === null || _a === void 0 ? void 0 : _a.colors) === null || _b === void 0 ? void 0 : _b.lower
                : (_d = (_c = this.options.candles) === null || _c === void 0 ? void 0 : _c.colors) === null || _d === void 0 ? void 0 : _d.higher;
            ctx.beginPath();
            this.lineTo(x, high, ctx);
            this.lineTo(x, low, ctx);
            ctx.strokeStyle = candleColor;
            ctx.stroke();
            if (halfCandle > 1) {
                this.rect(x - this.candlesSpace / 4, open, this.candlesSpace / 2, close - open, ctx);
                ctx.fillStyle = candleColor;
                ctx.fill();
            }
            ctx.closePath();
        }
    }
    windowMouseMoveHandler(e) {
        if (this.isZoomingXAxis && (e === null || e === void 0 ? void 0 : e.movementX)) {
            let zoomPoint = this.mainCanvasWidth;
            let d = 20 / this.zoomSpeed;
            this.position.right +=
                (((this.position.right - zoomPoint) / d) * (e === null || e === void 0 ? void 0 : e.movementX)) / 100;
            this.position.left +=
                (((this.position.left - zoomPoint) / d) * (e === null || e === void 0 ? void 0 : e.movementX)) / 100;
            this.clampXPanning();
            this.draw();
        }
    }
    windowMouseUpHandler(e) {
        this.isZoomingXAxis = false;
    }
    mouseMoveHandler(e) {
        if (this.panningIsActive) {
            this.moveChart(e.movementX);
        }
        this.movePointer();
        this.draw();
        this.drawPriceMarker();
        this.drawTimeMarker();
    }
    mouseEnterHandler() {
        this.pointerIsVisible = true;
    }
    mouseLeaveHandler() {
        this.pointerIsVisible = false;
        this.panningIsActive = false;
        this.draw();
    }
    mouseDownHandler(e) {
        if (e.button == 0) {
            e.preventDefault();
            this.panningIsActive = true;
        }
    }
    mouseUpHandler(e) {
        if (e.button == 0) {
            this.panningIsActive = false;
        }
    }
    wheelHandler(e) {
        let cs = this.candlesSpace;
        let wd = e.wheelDeltaY;
        if (wd < 0 && cs < 1.7)
            return;
        if (wd > 0 && cs > 350)
            return;
        this.zoomChart(wd > 1 ? 1 : -1);
        this.movePointer();
        this.draw();
        this.drawPriceMarker();
        this.drawTimeMarker();
    }
    yAxisMouseMoveHandler(e) {
        if (this.isZoomingYAxis && (e === null || e === void 0 ? void 0 : e.movementY)) {
            let f = this.yZoomFactor;
            f += ((e === null || e === void 0 ? void 0 : e.movementY) / 300) * f;
            this.yZoomFactor = f;
            this.draw();
        }
    }
    yAxisMouseDownHandler(e) {
        this.isZoomingYAxis = true;
    }
    yAxisMouseUpHandler(e) {
        this.isZoomingYAxis = false;
    }
    xAxisMouseDownHandler(e) {
        this.isZoomingXAxis = true;
    }
    xAxisMouseUpHandler(e) {
        this.isZoomingXAxis = false;
    }
}
exports.CandlesChart = CandlesChart;
//# sourceMappingURL=candles.js.map