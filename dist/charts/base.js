"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("../utils");
const config_1 = require("../config");
const ui_1 = require("../ui");
class ChartDataBase {
    constructor() {
        this.topHistoryPrice = [0, 0];
        this.bottomHistoryPrice = [0, 0];
    }
    get chartFullWidth() {
        return this.chart.position.right - this.chart.position.left;
    }
    init(chart) {
        this.chart = chart;
    }
    updatePoint(point, value) {
        point.close = value.PRICE;
        point.time = value.LASTUPDATE;
        if (point.close < point.low)
            point.low = point.close;
        if (point.close > point.high)
            point.high = point.close;
    }
    updateCurrentPoint(value) {
        if (!(value === null || value === void 0 ? void 0 : value.PRICE) || !(value === null || value === void 0 ? void 0 : value.LASTUPDATE))
            return;
        let hist = this.history;
        if (!(hist === null || hist === void 0 ? void 0 : hist.length))
            return;
        let currentPoint = hist[hist.length - 1];
        let pointMinutesTs = (0, utils_1.toMinutes)(value.LASTUPDATE * 1000);
        let currentPointMinutesTs = (0, utils_1.toMinutes)(currentPoint.time * 1000);
        if (currentPointMinutesTs == pointMinutesTs) {
            this.updatePoint(hist[hist.length - 1], value);
        }
        else if (pointMinutesTs > currentPointMinutesTs) {
            let pp = hist[hist.length - 1];
            if (value.PRICE < pp.low)
                pp.low = value.PRICE;
            if (value.PRICE > pp.high)
                pp.high = value.PRICE;
            pp.close = value.PRICE;
            hist.shift();
            hist.push({
                time: value.LASTUPDATE,
                high: value.PRICE,
                open: value.PRICE,
                close: value.PRICE,
                low: value.PRICE,
            });
        }
        this.draw();
    }
    /**
     * Get point X position.
     * @param {number | HistoryPoint} value a point or an index of it
     * @returns {number} X position
     */
    getPointX(value) {
        let i = value;
        let data = this.history;
        if (typeof value == 'object')
            i = data.indexOf(value);
        return this.chart.position.left + (this.chartFullWidth / data.length) * i;
    }
    filterVisiblePoints(data) {
        return data.filter((_, i) => {
            let x = this.getPointX(i);
            return x > 0 && x < this.chart.mainCanvasWidth;
        });
    }
    filterVisiblePointsAndCache() {
        if (!this.history)
            return [];
        this.visiblePoints = this.filterVisiblePoints(this.history);
        return this.visiblePoints;
    }
    normalizeY(value) {
        let h = this.chart.mainCanvasHeight;
        let min = this.bottomHistoryPrice[1];
        let max = this.topHistoryPrice[1];
        let normalize = (y) => ((y - min) / (max - min)) * h;
        let reverse = (y) => h - y;
        let convert = (y) => reverse(normalize(y));
        value = convert(value);
        min = convert(min);
        max = convert(max);
        let hh = Math.abs((max - min) / 2);
        let k = Math.abs(this.chart.yZoomFactor);
        value = (value - hh) / k + hh;
        return value;
    }
    normalizePoint(point) {
        let h = this.chart.mainCanvasHeight;
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
        let k = Math.abs(this.chart.yZoomFactor);
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
        let h = this.chart.mainCanvasHeight;
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
            let k = Math.abs(this.chart.yZoomFactor);
            p.close = (p.close - hh) / k + hh;
            p.open = (p.open - hh) / k + hh;
            p.high = (p.high - hh) / k + hh;
            p.low = (p.low - hh) / k + hh;
            return p;
        });
        return result;
    }
    getTopHistoryPrice() {
        let history = this.visiblePoints || this.filterVisiblePointsAndCache();
        history = history.map(({ high }) => high);
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
        let history = this.visiblePoints || this.filterVisiblePointsAndCache();
        history = history.map(({ low }) => low);
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
}
class Chart extends ChartDataBase {
    constructor(container, options) {
        super();
        this.options = config_1.defaultChartOptions;
        this.mousePosition = { x: 0, y: 0 };
        this.zoomSpeed = 4;
        this.yZoomFactor = 1.2;
        this.init(this);
        if (options)
            this.options = Object.assign(Object.assign({}, this.options), options);
        this.chartContext = document.createElement('canvas').getContext('2d');
        this.yAxisContext = document.createElement('canvas').getContext('2d');
        this.xAxisContext = document.createElement('canvas').getContext('2d');
        this.chartContext.lineWidth = 1 * this.getPixelRatio(this.chartContext);
        if (typeof container === 'string') {
            this.container = document.querySelector(container);
        }
        if (!this.container) {
            this.error('no container is found');
            return;
        }
        this.createChartMarkup();
        this.position = {
            y: 0,
            left: 0,
            right: this.mainCanvasWidth,
        };
    }
    loadHistory(value) {
        this.history = value;
        this.chartData = this.normalizeData();
        this.initUIElements();
        this.draw();
    }
    setTicker(ticker) {
        this.ticker = ticker;
        this.draw();
        setInterval(() => {
            this.updateCurrentPoint(ticker.state);
        }, 500);
    }
    createChart() {
        let canvas = this.chartContext.canvas;
        const preventDefault = function (e) {
            e.preventDefault();
            e.stopPropagation();
        };
        canvas.oncontextmenu = preventDefault;
        canvas.onwheel = preventDefault;
        canvas.style.gridArea = '1 / 1 / 2 / 2';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.cursor = 'crosshair';
        this.rescale(this.chartContext);
        this.bindMouseListeners();
        return canvas;
    }
    createXAxis() {
        let canvas = this.xAxisContext.canvas;
        let ctx = canvas.getContext('2d');
        this.xAxisContext = ctx;
        canvas.style.gridArea = '2 / 1 / 3 / 3';
        canvas.style.width = 'calc(100% - 70px)';
        canvas.style.height = '28px';
        canvas.style.cursor = 'e-resize';
        this.bindXAxisListeners();
        return canvas;
    }
    createYAxis() {
        let canvas = this.yAxisContext.canvas;
        let ctx = canvas.getContext('2d');
        this.yAxisContext = ctx;
        canvas.style.gridArea = '1 / 2 / 2 / 3';
        canvas.style.width = '70px';
        canvas.style.height = '100%';
        canvas.style.cursor = 'n-resize';
        this.bindYAxisListeners();
        return canvas;
    }
    createChartMarkup() {
        this.container.innerHTML = '';
        this.container.style.display = 'grid';
        this.container.style.grid = '1fr 28px / 1fr 70px';
        let chartCanvas = this.createChart();
        let yAxisCanvas = this.createYAxis();
        let xAxisCanvas = this.createXAxis();
        let rect = this.container.getBoundingClientRect();
        this.setSize(rect.width - 70, rect.height - 28, chartCanvas);
        window.addEventListener('resize', () => {
            rect = this.container.getBoundingClientRect();
            this.setSize(rect.width - 70, rect.height - 28, chartCanvas);
            this.setSize(rect.width - 70, 28, xAxisCanvas);
            this.setSize(70, rect.height - 28, yAxisCanvas);
            this.clampXPanning();
            this.draw();
        });
        window.addEventListener('mousemove', (e) => this.windowMouseMoveHandler(e));
        window.addEventListener('mouseup', (e) => this.windowMouseUpHandler(e));
        this.container.appendChild(chartCanvas);
        this.container.appendChild(xAxisCanvas);
        this.container.appendChild(yAxisCanvas);
        this.rescale(this.chartContext);
        this.rescale(this.yAxisContext);
        this.rescale(this.xAxisContext);
        this.ui = new ui_1.UI();
    }
    initUIElements() {
        let h = this.history;
        let getCandleColor = () => {
            var _a, _b, _c, _d, _e, _f;
            let p = h[h.length - 1];
            return p.close < p.open ? (_c = (_b = (_a = this.options) === null || _a === void 0 ? void 0 : _a.candles) === null || _b === void 0 ? void 0 : _b.colors) === null || _c === void 0 ? void 0 : _c.lower : (_f = (_e = (_d = this.options) === null || _d === void 0 ? void 0 : _d.candles) === null || _e === void 0 ? void 0 : _e.colors) === null || _f === void 0 ? void 0 : _f.higher;
        };
        let commonOpts = () => {
            var _a;
            return ({
                x: 0,
                y: 23,
                font: 'Arial',
                size: 13,
                color: (_a = this.options) === null || _a === void 0 ? void 0 : _a.textColor,
                ctx: this.chartContext
            });
        };
        let topbarGroup = new ui_1.UIElementGroup({
            x: 10,
            y: 23,
            gap: 2,
            elements: [
                new ui_1.Label(Object.assign(Object.assign({ value: () => { var _a; return ((_a = this.ticker) === null || _a === void 0 ? void 0 : _a.currency) + ' / TetherUS - BINANCE - CryptoView'; } }, commonOpts()), { size: 17 })),
                30,
                new ui_1.Label(Object.assign({ value: 'O' }, commonOpts())),
                new ui_1.Label(Object.assign(Object.assign({ value: () => h[h.length - 1].open }, commonOpts()), { color: getCandleColor })),
                10,
                new ui_1.Label(Object.assign({ value: 'H' }, commonOpts())),
                new ui_1.Label(Object.assign(Object.assign({ value: () => h[h.length - 1].high }, commonOpts()), { color: getCandleColor })),
                10,
                new ui_1.Label(Object.assign({ value: 'L' }, commonOpts())),
                new ui_1.Label(Object.assign(Object.assign({ value: () => h[h.length - 1].low }, commonOpts()), { color: getCandleColor })),
                10,
                new ui_1.Label(Object.assign({ value: 'C' }, commonOpts())),
                new ui_1.Label(Object.assign(Object.assign({ value: () => h[h.length - 1].close }, commonOpts()), { color: getCandleColor })),
            ],
            ctx: this.chartContext
        });
        this.ui.elements.push(topbarGroup);
    }
    // abstract xAxisMouseLeaveHandler(e?: MouseEvent): void
    bindMouseListeners() {
        let canvas = this.chartContext.canvas;
        canvas.addEventListener('mousemove', (e) => {
            this.mousePosition.x = e.clientX;
            this.mousePosition.y = e.clientY;
            this.mouseMoveHandler(e);
        });
        canvas.addEventListener('mouseleave', (e) => this.mouseLeaveHandler(e));
        canvas.addEventListener('mouseenter', (e) => this.mouseEnterHandler(e));
        canvas.addEventListener('mousedown', (e) => this.mouseDownHandler(e));
        canvas.addEventListener('mouseup', (e) => this.mouseUpHandler(e));
        canvas.addEventListener('wheel', (e) => this.wheelHandler(e));
    }
    bindYAxisListeners() {
        let canvas = this.yAxisContext.canvas;
        canvas.addEventListener('mousemove', (e) => this.yAxisMouseMoveHandler(e));
        canvas.addEventListener('mousedown', (e) => this.yAxisMouseDownHandler(e));
        canvas.addEventListener('mouseup', (e) => this.yAxisMouseUpHandler(e));
        // canvas.addEventListener('mouseleave', (e) => this.yAxisMouseLeaveHandler(e))
    }
    bindXAxisListeners() {
        let canvas = this.xAxisContext.canvas;
        // canvas.addEventListener('mousemove', (e) => this.xAxisMouseMoveHandler(e))
        canvas.addEventListener('mousedown', (e) => this.xAxisMouseDownHandler(e));
        canvas.addEventListener('mouseup', (e) => this.xAxisMouseUpHandler(e));
        // canvas.addEventListener('mouseleave', (e) => this.xAxisMouseLeaveHandler(e))
    }
    getWidth(ctx) {
        return ctx.canvas.width * this.getPixelRatio(ctx);
    }
    getHeight(ctx) {
        return ctx.canvas.height * this.getPixelRatio(ctx);
    }
    get mainCanvasWidth() {
        return (this.chartContext.canvas.clientWidth *
            this.getPixelRatio(this.chartContext));
    }
    get mainCanvasHeight() {
        return (this.chartContext.canvas.clientHeight *
            this.getPixelRatio(this.chartContext));
    }
    get canvasRect() {
        return this.chartContext.canvas.getBoundingClientRect();
    }
    setSize(w, h, canvas) {
        canvas.width = w;
        canvas.height = h;
    }
    rescale(ctx) {
        let pixelRatio = this.getPixelRatio(ctx);
        let width = ctx.canvas.clientWidth * pixelRatio;
        let height = ctx.canvas.clientHeight * pixelRatio;
        if (width != ctx.canvas.width)
            ctx.canvas.width = width;
        if (height != ctx.canvas.height)
            ctx.canvas.height = height;
        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    }
    getSharpPixel(pos, ctx, thickness = 1) {
        if (thickness % 2 == 0) {
            return pos;
        }
        return pos + this.getPixelRatio(ctx) / 2;
    }
    getPixelRatio(context) {
        let dpr = window.devicePixelRatio || 1;
        let bsr = context.webkitBackingStorePixelRatio ||
            context.mozBackingStorePixelRatio ||
            context.msBackingStorePixelRatio ||
            context.oBackingStorePixelRatio ||
            context.backingStorePixelRatio ||
            1;
        return dpr / bsr;
    }
    moveTo(x, y, ctx) {
        ctx.moveTo(this.getSharpPixel(x, ctx), this.getSharpPixel(y, ctx));
    }
    lineTo(x, y, ctx) {
        ctx.lineTo(this.getSharpPixel(x, ctx), this.getSharpPixel(y, ctx));
    }
    rect(x, y, w, h, ctx) {
        ctx.rect(this.getSharpPixel(x, ctx), this.getSharpPixel(y, ctx), this.getSharpPixel(w, ctx), this.getSharpPixel(h, ctx));
    }
    clear(ctx) {
        ctx.clearRect(0, 0, this.getWidth(ctx), this.getHeight(ctx));
    }
    error(msg) {
        throw new Error('CryptoView Error: ' + msg);
    }
    log(...msg) {
        console.log('CryptoView Log: ', ...msg);
    }
    debug(text, x, y) {
        this.chartContext.fillStyle = 'white';
        this.chartContext.font = '20px Arial';
        this.chartContext.fillText(text, x, y);
    }
}
exports.default = Chart;
//# sourceMappingURL=base.js.map