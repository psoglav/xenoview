"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CandlesChart = void 0;
const chart_1 = require("../core/chart");
class CandlesChart extends chart_1.Chart {
    constructor(container, options) {
        super(container, options);
        this.panningIsActive = false;
    }
    draw() {
        this.clear(this.chartContext);
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
            this.mainDebug();
        }
    }
    clampXPanning() {
        if (this.position.left > 0)
            this.position.left = 0;
        if (this.position.right < this.mainCanvasWidth - 200)
            this.position.right = this.mainCanvasWidth - 200;
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
            let x = this.position.left + i * this.pointsGap;
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
    windowMouseMoveHandler(e) {
        this.timeAxis.zoom(e === null || e === void 0 ? void 0 : e.movementX);
        this.priceAxis.zoom(e === null || e === void 0 ? void 0 : e.movementY);
    }
    mouseMoveHandler(e) {
        if (this.panningIsActive) {
            let mx = e.movementX;
            let my = this.options.autoScale ? 0 : e.movementY;
            this.move(mx, my);
        }
        this.pointer.move();
        this.draw();
    }
    mouseEnterHandler() {
        this.pointer.isVisible = true;
    }
    mouseLeaveHandler() {
        this.pointer.isVisible = false;
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
        let cs = this.pointsGap;
        let wd = e.wheelDeltaY;
        if (wd < 0 && cs < 1.7)
            return;
        if (wd > 0 && cs > 350)
            return;
        this.zoom(wd > 1 ? 1 : -1, 0);
        this.pointer.move();
        this.draw();
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