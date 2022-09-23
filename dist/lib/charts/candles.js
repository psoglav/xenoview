"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandlesChart = void 0;
const utils_1 = require("../../utils");
const base_1 = __importDefault(require("../base"));
class CandlesChart extends base_1.default {
    constructor(container, options) {
        super(container, options);
        this.pointingPointIndex = 4;
        this.pointerIsVisible = false;
        this.panningIsActive = false;
        this.candlesSpace = 0;
        this.isZoomingPriceAxis = false;
        this.isZoomingTimeAxis = false;
    }
    draw() {
        this.clear(this.chartContext);
        this.clear(this.timeAxisContext);
        this.clear(this.priceAxisContext);
        if (!this.history) {
            this.loading();
        }
        else {
            this.drawGridColumns();
            this.drawGridRows();
            this.drawTimeAxisLabels();
            this.drawPriceAxisLabels();
            this.drawChart();
            this.drawPointer();
            this.drawCurrentMarketPriceMarker();
            if (this.pointerIsVisible) {
                this.drawTimeMarker();
                this.drawPriceMarker();
            }
            this.ui.draw();
            this.mainDebug();
        }
    }
    zoomChart(side) {
        var _a;
        let zoomPoint = this.mainCanvasWidth;
        let d = 20 / this.zoomSpeed;
        this.position.right += ((this.position.right - zoomPoint) / d) * side;
        this.position.left += ((this.position.left - zoomPoint) / d) * side;
        this.clampXPanning();
        if ((_a = this.options) === null || _a === void 0 ? void 0 : _a.autoScale)
            this.filterVisiblePointsAndCache();
    }
    moveChart(mx, my) {
        var _a;
        this.position.top += my;
        this.position.bottom += my;
        if (this.position.right == this.mainCanvasWidth - 200 && mx < 0)
            return;
        if (this.position.left == 0 && mx > 0)
            return;
        this.position.left += mx;
        this.position.right += mx;
        this.clampXPanning();
        if ((_a = this.options) === null || _a === void 0 ? void 0 : _a.autoScale)
            this.filterVisiblePointsAndCache();
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
        this.pointingPointIndex =
            i > data.length - 1 ? data.length - 1 : i < 0 ? 0 : i;
        this.focusedPoint = this.history[this.pointingPointIndex];
    }
    loading() { }
    drawPointer() {
        var _a;
        if (!((_a = this.chartData) === null || _a === void 0 ? void 0 : _a.length) || !this.pointerIsVisible)
            return;
        let ctx = this.chartContext;
        let x = this.position.left + this.candlesSpace * this.pointingPointIndex;
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
        let { close, open } = this.normalizePoint(point);
        let y = close;
        let type = close < open ? 'higher' : 'lower';
        ctx.strokeStyle = this.options.candles.colors[type];
        ctx.setLineDash([1, 2]);
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(this.mainCanvasWidth, y);
        ctx.closePath();
        ctx.stroke();
        ctx.setLineDash([]);
        ctx = this.priceAxisContext;
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
        let ctx = this.priceAxisContext;
        let y = this.mousePosition.y - this.canvasRect.top;
        let price = this.normalizeToPrice(y);
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
        let ctx = this.timeAxisContext;
        let data = this.history;
        if (!data)
            return;
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
    getGridRows2() {
        let t = this.topHistoryPrice[1];
        let b = this.bottomHistoryPrice[1];
        let dist = t - b;
        let yScale = Math.round((this.position.bottom - this.position.top) / 100) * 100;
        let step = dist / (this.mainCanvasHeight / 100);
        // step = yScale
        let result = (0, utils_1.rangeByStep)(t, b, yScale);
        let cur = result[0];
        while (cur > 0) {
            result.unshift(cur -= yScale);
        }
        cur = result[result.length - 1];
        while (cur < this.mainCanvasHeight) {
            result.push(cur += yScale);
        }
        return result;
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
        while (this.normalizeToY((start / length) * delta + b) <
            this.getWidth(this.chartContext)) {
            start -= step;
            step += 5;
            if (start < -5000)
                break;
        }
        step = 0;
        while (this.normalizeToY((end / length) * delta + b) > 0) {
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
            let y = this.normalizeToY(i);
            let py = this.normalizeToY(prev);
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
            let y = this.normalizeToY(i);
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
    drawPriceAxisLabels() {
        let ctx = this.priceAxisContext;
        let rows = this.getGridRows();
        for (let i of rows) {
            let y = this.normalizeToY(i);
            this.moveTo(0, y, ctx);
            this.lineTo(this.getWidth(ctx), y, ctx);
            let fz = 11;
            ctx.fillStyle = this.options.textColor;
            ctx.font = fz + 'px Verdana';
            ctx.fillText(i.toFixed(2), 10, y - 2 + fz / 2);
        }
    }
    drawTimeAxisLabels() {
        var _a, _b;
        let ctx = this.timeAxisContext;
        let cols = this.getGridColumns();
        this.clear(ctx);
        ctx.beginPath();
        let size = ((_b = (_a = this.options.timeAxis) === null || _a === void 0 ? void 0 : _a.labels) === null || _b === void 0 ? void 0 : _b.fontSize) || 11;
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
    drawPriceAxis() {
        let ctx = this.chartContext;
        let priceAxisCtx = this.priceAxisContext;
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
        this.clear(priceAxisCtx);
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
            priceAxisCtx.fillStyle = this.options.textColor;
            priceAxisCtx.font = fz + 'px Verdana';
            let price = i * ((t - b) / segments);
            priceAxisCtx.fillText(round(price + b).toFixed(2), 10, y + br - 2 + fz / 2);
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
                this.rect(x - this.candlesSpace / 4, open, this.candlesSpace / 2, close - open, ctx);
                ctx.fillStyle = candleColor;
                ctx.fill();
            }
            ctx.closePath();
        }
    }
    zoomPriceAxis(dy) {
        if (this.isZoomingPriceAxis && dy) {
            let origin = this.mainCanvasHeight / 2;
            let d = 20 / (this.zoomSpeed * 2);
            this.position.top -= (((this.position.top - origin) / d) * dy) / 100;
            this.position.bottom -= (((this.position.bottom - origin) / d) * dy) / 100;
            this.draw();
        }
    }
    zoomTimeAxis(mx) {
        var _a;
        if (this.isZoomingTimeAxis && mx) {
            let zoomPoint = this.mainCanvasWidth;
            let d = 20 / this.zoomSpeed;
            this.position.right +=
                (((this.position.right - zoomPoint) / d) * mx) / 100;
            this.position.left += (((this.position.left - zoomPoint) / d) * mx) / 100;
            this.clampXPanning();
            if ((_a = this.options) === null || _a === void 0 ? void 0 : _a.autoScale)
                this.filterVisiblePointsAndCache();
            this.draw();
        }
    }
    windowMouseMoveHandler(e) {
        this.zoomTimeAxis(e === null || e === void 0 ? void 0 : e.movementX);
        this.zoomPriceAxis(e === null || e === void 0 ? void 0 : e.movementY);
    }
    windowMouseUpHandler(e) {
        this.isZoomingTimeAxis = false;
        this.isZoomingPriceAxis = false;
    }
    mouseMoveHandler(e) {
        if (this.panningIsActive) {
            let mx = e.movementX;
            let my = this.options.autoScale ? 0 : e.movementY;
            this.moveChart(mx, my);
        }
        this.movePointer();
        this.draw();
    }
    mouseEnterHandler() {
        this.pointerIsVisible = true;
    }
    mouseLeaveHandler() {
        this.pointerIsVisible = false;
        this.panningIsActive = false;
        this.focusedPoint = null;
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
    }
    priceAxisMouseDownHandler(e) {
        this.isZoomingPriceAxis = true;
    }
    priceAxisMouseUpHandler(e) {
        this.isZoomingPriceAxis = false;
    }
    timeAxisMouseDownHandler(e) {
        this.isZoomingTimeAxis = true;
    }
    timeAxisMouseUpHandler(e) {
        this.isZoomingTimeAxis = false;
    }
    mainDebug() {
        // let { top, bottom } = this.position
        // let y = 50
        // let minY = this.position.top
        // let maxY = this.position.bottom
        // let minPrice = this.bottomHistoryPrice[1]
        // let maxPrice = this.topHistoryPrice[1]
        // this.debug('top: ' + top, 100, (y += 20))
        // this.debug('bottom: ' + bottom, 100, (y += 20))
        // this.debug('my: ' + this.mousePosition.y, 100, (y += 20))
        // this.debug('minY: ' + minY, 100, (y += 20))
        // this.debug('maxY: ' + maxY, 100, (y += 20))
        // this.debug('minPrice: ' + minPrice, 100, (y += 20))
        // this.debug('maxPrice: ' + maxPrice, 100, (y += 20))
        // this.debug(
        //   'myPrice: ' + this.normalizeToPrice(this.mousePosition.y),
        //   100,
        //   (y += 20),
        // )
    }
}
exports.CandlesChart = CandlesChart;
//# sourceMappingURL=candles.js.map