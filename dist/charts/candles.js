"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandlesChart = void 0;
const utils_1 = require("../utils");
const base_1 = require("./base");
class CandlesChart extends base_1.default {
    constructor(container, data, options) {
        super(container, options);
        this.pointerYPosIndex = 4;
        this.pointerIsVisible = false;
        this.panningIsActive = false;
        this.candlesSpace = 0;
        this.yZoomFactor = 1.2;
        this.isZoomingYAxis = false;
        this.isZoomingXAxis = false;
        this.mousePosition = { x: 0, y: 0 };
        this.topHistoryPrice = [0, 0];
        this.bottomHistoryPrice = [0, 0];
        if (data)
            this.loadHistory(data);
        this.draw();
    }
    getTopHistoryPrice() {
        let history = this.filterVisiblePoints(this.history.map(({ high }) => high));
        let max = history[0];
        let i = 0;
        history.forEach((p, ii) => {
            if (p > max) {
                max = p;
                i = ii;
            }
        });
        this.topHistoryPrice = [i, max];
        return this.topHistoryPrice;
    }
    getBottomHistoryPrice() {
        let history = this.filterVisiblePoints(this.history.map(({ low }) => low));
        let min = history[0];
        let i = 0;
        history.forEach((p, ii) => {
            if (p < min) {
                min = p;
                i = ii;
            }
        });
        this.bottomHistoryPrice = [i, min];
        return this.bottomHistoryPrice;
    }
    getStartDataPoint() {
        if (this.history == null || !this.history.length)
            return [0, 0];
        return this.filterVisiblePoints(this.history)[0];
    }
    getEndDataPoint() {
        if (this.history == null || !this.history.length)
            return [0, 0];
        let data = this.filterVisiblePoints(this.history);
        console.log(data[data.length - 1]);
        return data[data.length - 1];
    }
    get floatingWidth() {
        return this.position.right - this.position.left;
    }
    windowMouseMoveHandler(e) {
        if (this.isZoomingXAxis && (e === null || e === void 0 ? void 0 : e.movementX)) {
            let zoomPoint = this.width;
            let d = 20 / this.zoomSpeed;
            this.position.right +=
                (((this.position.right - zoomPoint) / d) * (e === null || e === void 0 ? void 0 : e.movementX)) / 100;
            this.position.left +=
                (((this.position.left - zoomPoint) / d) * (e === null || e === void 0 ? void 0 : e.movementX)) / 100;
            this.clampXPanning();
            // this.chartData = this.normalizeData()
            // this.filterVisiblePointsAndCache()
            // let pos = this.mousePosition.x / this.width
            // this.position.left -= e.movementX * 10 * this.yZoomFactor * pos
            // this.clampXPanning()
            this.draw();
        }
    }
    windowMouseUpHandler(e) {
        this.isZoomingXAxis = false;
    }
    mouseMoveHandler(e) {
        this.mousePosition.x = e.clientX;
        this.mousePosition.y = e.clientY;
        if (this.panningIsActive) {
            this.moveChart(e.movementX);
        }
        this.movePointer();
        this.draw();
        this.drawPricePointer();
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
        this.drawPricePointer();
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
    zoomYAxis(side) {
        // in dev
        this.position.bottom += (this.position.bottom / 20) * side;
        this.position.top -= (this.position.top / 20) * side;
    }
    zoomChart(side) {
        let zoomPoint = this.width;
        let d = 20 / this.zoomSpeed;
        this.position.right += ((this.position.right - zoomPoint) / d) * side;
        this.position.left += ((this.position.left - zoomPoint) / d) * side;
        this.clampXPanning();
        this.filterVisiblePointsAndCache();
    }
    moveChart(movement) {
        if (this.position.right == this.width - 200 && movement < 0)
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
        if (this.position.right < this.width - 200)
            this.position.right = this.width - 200;
    }
    filterVisiblePointsAndCache() {
        let hist = this.history;
        if (!hist)
            return [];
        this.visibleData = this.filterVisiblePoints(hist);
        return this.visibleData;
    }
    filterVisiblePoints(data) {
        return data.filter((_, i) => {
            let x = this.position.left + (this.floatingWidth / data.length) * i;
            return x > 0 && x < this.width;
        });
    }
    movePointer() {
        let data = this.chartData;
        if (!(data === null || data === void 0 ? void 0 : data.length))
            return;
        let x = this.mousePosition.x - this.canvasRect.x;
        x = ((x - this.position.left) / this.floatingWidth) * data.length;
        let i = Math.round(x);
        this.pointerYPosIndex =
            i > data.length - 1 ? data.length - 1 : i < 0 ? 0 : i;
    }
    draw() {
        this.chartContext.clearRect(0, 0, this.width, this.height);
        if (this.chartData) {
            this.drawXAxis();
            this.drawYAxis();
        }
        this.drawChart();
        this.drawPointer();
        this.mainDebug();
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
        this.moveTo(x, 0, ctx);
        this.lineTo(x, this.height, ctx);
        this.moveTo(0, y - this.canvasRect.top, ctx);
        ctx.lineTo(this.width, y - this.canvasRect.top);
        ctx.stroke();
        ctx.closePath();
        ctx.setLineDash([]);
    }
    drawPricePointer() {
        let ctx = this.yAxisContext;
        let y = this.mousePosition.y - this.canvasRect.top;
        let h = this.height;
        let t = this.topHistoryPrice[1];
        let b = this.bottomHistoryPrice[1];
        let normalize = (y) => ((y - b) / (t - b)) * h;
        let reverse = (y) => h - y;
        let convert = (y) => reverse(normalize(y));
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
    mainDebug() {
        // this.debug(, 10, 300)
    }
    drawXAxis() {
        let ctx = this.chartContext;
        let xAxisCtx = this.xAxisContext;
        let segments = this.history.length / 50, h = this.height, w = this.width;
        let left = this.position.left;
        let right = this.position.right;
        this.clear(xAxisCtx);
        ctx.beginPath();
        ctx.strokeStyle = '#7777aa33';
        let xw = this.floatingWidth < this.width ? this.width : this.floatingWidth;
        let step = xw / segments;
        while (step > 150) {
            segments += 2;
            step = xw / segments;
        }
        while (step < 50) {
            segments -= 2;
            step = xw / segments;
        }
        for (let i = 0; i <= segments; i++) {
            let x = i * step + left;
            this.moveTo(x, 0, ctx);
            this.lineTo(x, h, ctx);
            let fz = 11;
            xAxisCtx.fillStyle = this.options.textColor;
            xAxisCtx.font = fz + 'px Verdana';
            let k = Math.floor((x / xw) * this.history.length);
            let point = this.history[k];
            if (!point)
                continue;
            let time = (0, utils_1.getTimeFromTimestamp)(point.time * 1000);
            xAxisCtx.fillText(time, x - 16, 16);
        }
        ctx.stroke();
        ctx.closePath();
    }
    drawYAxis() {
        let ctx = this.chartContext;
        let yAxisCtx = this.yAxisContext;
        let segments = 20, h = this.height, w = this.width;
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
        this.moveTo(this.position.left - 10, this.height, ctx);
        for (let i = 0; i < data.length; i++) {
            this.candlesSpace = this.floatingWidth / data.length;
            let x = this.position.left + i * this.candlesSpace;
            let halfCandle = this.candlesSpace / 4;
            if (x > this.width + halfCandle)
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
    loadHistory(data) {
        this.history = data;
        this.chartData = this.normalizeData();
        this.draw();
    }
    normalizePoint(point) {
        let h = this.height;
        let min = this.bottomHistoryPrice[1];
        let max = this.topHistoryPrice[1];
        let normalize = (y) => ((y - min) / (max - min)) * h;
        let reverse = (y) => h - y;
        let convert = (y) => reverse(normalize(y));
        let p = Object.create(point);
        p.close = convert(p.close);
        p.open = convert(p.open);
        p.high = convert(p.high);
        p.low = convert(p.low);
        min = convert(min);
        max = convert(max);
        let hh = Math.abs((max - min) / 2);
        let k = Math.abs(this.yZoomFactor);
        p.close = (p.close - hh) / k + hh;
        p.open = (p.open - hh) / k + hh;
        p.high = (p.high - hh) / k + hh;
        p.low = (p.low - hh) / k + hh;
        return p;
    }
    normalizeData() {
        let hist = this.history;
        if (!(hist === null || hist === void 0 ? void 0 : hist.length))
            return [];
        let result = hist === null || hist === void 0 ? void 0 : hist.map((n) => (Object.assign({}, n)));
        let h = this.height;
        let min = this.getBottomHistoryPrice()[1];
        let max = this.getTopHistoryPrice()[1];
        let normalize = (y) => ((y - min) / (max - min)) * h;
        let reverse = (y) => h - y;
        let convert = (y) => reverse(normalize(y));
        for (let i = 0; i < hist.length; i++) {
            result[i].close = convert(result[i].close);
            result[i].open = convert(result[i].open);
            result[i].high = convert(result[i].high);
            result[i].low = convert(result[i].low);
        }
        min = convert(min);
        max = convert(max);
        let hh = Math.abs((max - min) / 2);
        result = result.map((point) => {
            let p = Object.create(point);
            let k = Math.abs(this.yZoomFactor);
            p.close = (p.close - hh) / k + hh;
            p.open = (p.open - hh) / k + hh;
            p.high = (p.high - hh) / k + hh;
            p.low = (p.low - hh) / k + hh;
            return p;
        });
        return result;
    }
}
exports.CandlesChart = CandlesChart;
//# sourceMappingURL=candles.js.map