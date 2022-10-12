"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chart = void 0;
const components_1 = require("../components");
const _1 = require(".");
const chartStyles_1 = require("../chartStyles");
require("../../public/styles/main.css");
const defaultChartOptions = {
    style: 'candles',
    bgColor: '#151924',
    textColor: '#b2b5be',
    autoScale: false,
    spinnerColor: '#b2b5be',
    pointer: {
        bgColor: '#363a45',
        fgColor: '#9598a1'
    },
    candles: {
        colors: {
            higher: '#089981',
            lower: '#f23645'
        }
    },
    line: {
        color: '#089981',
        width: 2
    }
};
class Chart extends _1.ChartData {
    constructor(container, options) {
        super();
        this.options = defaultChartOptions;
        this.mousePosition = { x: 0, y: 0 };
        this.initData(this);
        if (options)
            this.options = Object.assign(Object.assign({}, this.options), options);
        this.createChartLayout(container);
        this.style = (0, chartStyles_1.createChartStyle)(this);
        this.pointer = new components_1.Pointer(this);
        this.priceAxis = new components_1.PriceAxis(this);
        this.timeAxis = new components_1.TimeAxis(this);
        this.loader = new components_1.Loader(this);
        this.transform = new _1.Transform(this);
        this.bindEventListeners();
    }
    get ctx() {
        return this.canvas.getContext('2d');
    }
    get boundingRect() {
        return this.transform.boundingRect;
    }
    set boundingRect(value) {
        this.transform.boundingRect = value;
    }
    loadHistory(value) {
        this.transform.reset();
        this.history = value;
        this.visiblePoints = null;
        this.chartData = this.normalizeData();
        this.initUIElements();
        this.loading(false);
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
        const preventDefault = function (e) {
            e.preventDefault();
            e.stopPropagation();
        };
        this.canvas.oncontextmenu = preventDefault;
        this.canvas.onwheel = preventDefault;
        this.canvas.style.gridArea = '1 / 1 / 2 / 2';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.cursor = 'crosshair';
        this.canvas.style.transition = 'opacity .5s ease';
        this.rescale(this.ctx);
    }
    loading(value) {
        this.loader.isActive = value;
    }
    createChartLayout(container) {
        this.canvas = document.createElement('canvas');
        this.ctx.lineWidth = 1 * this.getPixelRatio(this.ctx);
        if (typeof container === 'string') {
            this.container = document.querySelector(container);
        }
        if (!this.container) {
            this.error('no container is found');
            return;
        }
        this.container.classList.add('chart-container');
        this.container.innerHTML = '';
        this.container.style.display = 'grid';
        this.container.style.position = 'relative';
        this.container.style.grid = '1fr 28px / 1fr 70px';
        this.createChart();
        let rect = this.container.getBoundingClientRect();
        this.setSize(rect.width - 70, rect.height - 28, this.canvas);
        window.addEventListener('resize', () => {
            rect = this.container.getBoundingClientRect();
            this.setSize(rect.width - 70, rect.height - 28, this.canvas);
            this.transform.clamp();
            this.draw();
        });
        this.container.appendChild(this.canvas);
        this.rescale(this.ctx);
        this.ui = new _1.UI();
    }
    initUIElements() {
        let h = this.history;
        let getPoint = () => this.pointer.focusedPoint || h[h.length - 1];
        let getCandleColor = () => {
            var _a, _b, _c, _d, _e, _f;
            let p = getPoint();
            return p.close < p.open
                ? (_c = (_b = (_a = this.options) === null || _a === void 0 ? void 0 : _a.candles) === null || _b === void 0 ? void 0 : _b.colors) === null || _c === void 0 ? void 0 : _c.lower
                : (_f = (_e = (_d = this.options) === null || _d === void 0 ? void 0 : _d.candles) === null || _e === void 0 ? void 0 : _e.colors) === null || _f === void 0 ? void 0 : _f.higher;
        };
        let commonOpts = () => {
            var _a;
            return ({
                x: 0,
                y: 23,
                font: 'Arial',
                size: 13,
                color: (_a = this.options) === null || _a === void 0 ? void 0 : _a.textColor,
                ctx: this.ctx
            });
        };
        let topbarGroup = new _1.UIElementGroup({
            x: 10,
            y: 23,
            gap: 2,
            elements: [
                new _1.Label(Object.assign(Object.assign({ value: () => { var _a; return ((_a = this.ticker) === null || _a === void 0 ? void 0 : _a.currency) + ' / TetherUS - BINANCE - CryptoView'; } }, commonOpts()), { size: 17 })),
                30,
                new _1.Label(Object.assign({ value: 'O' }, commonOpts())),
                new _1.Label(Object.assign(Object.assign({ value: () => getPoint().open }, commonOpts()), { color: getCandleColor })),
                10,
                new _1.Label(Object.assign({ value: 'H' }, commonOpts())),
                new _1.Label(Object.assign(Object.assign({ value: () => getPoint().high }, commonOpts()), { color: getCandleColor })),
                10,
                new _1.Label(Object.assign({ value: 'L' }, commonOpts())),
                new _1.Label(Object.assign(Object.assign({ value: () => getPoint().low }, commonOpts()), { color: getCandleColor })),
                10,
                new _1.Label(Object.assign({ value: 'C' }, commonOpts())),
                new _1.Label(Object.assign(Object.assign({ value: () => getPoint().close }, commonOpts()), { color: getCandleColor }))
            ],
            ctx: this.ctx
        });
        this.ui.elements = [];
        this.ui.elements.push(topbarGroup);
    }
    bindEventListeners() {
        this.canvas.addEventListener('mouseenter', () => {
            this.pointer.isVisible = true;
        });
        this.canvas.addEventListener('mouseleave', () => {
            this.pointer.isVisible = false;
            this.draw();
        });
        this.canvas.addEventListener('mousedown', e => {
            if (e.button == 0) {
                e.preventDefault();
                this.transform.isPanning = true;
            }
        });
        window.addEventListener('mousemove', e => {
            this.mousePosition.x = e.clientX;
            this.mousePosition.y = e.clientY;
            if (this.transform.isPanning) {
                let mx = e.movementX;
                let my = this.options.autoScale ? 0 : e.movementY;
                this.transform.move(mx, my);
            }
            this.pointer.move();
            this.draw();
        });
        window.addEventListener('mouseup', e => {
            if (e.button == 0) {
                this.transform.isPanning = false;
            }
        });
        this.canvas.addEventListener('wheel', (e) => {
            this.transform.zoom(e.wheelDeltaY, e.altKey ? -e.wheelDeltaY / 2 : 0, e.ctrlKey ? this.mousePosition.x : null);
            this.pointer.move();
            this.draw();
        });
    }
    getWidth(ctx) {
        return ctx.canvas.width * this.getPixelRatio(ctx);
    }
    getHeight(ctx) {
        return ctx.canvas.height * this.getPixelRatio(ctx);
    }
    get mainCanvasWidth() {
        return this.ctx.canvas.clientWidth;
    }
    get mainCanvasHeight() {
        return this.ctx.canvas.clientHeight;
    }
    get canvasRect() {
        return this.ctx.canvas.getBoundingClientRect();
    }
    toggleAutoScale() {
        this.options.autoScale = !this.options.autoScale;
        if (this.options.autoScale) {
            this.boundingRect.top = 0;
            this.boundingRect.bottom = this.mainCanvasHeight;
            this.filterVisiblePointsAndCache();
            this.draw();
        }
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
        if (!ctx)
            ctx = this.ctx;
        ctx.moveTo(this.getSharpPixel(Math.round(x), ctx), this.getSharpPixel(Math.round(y), ctx));
    }
    lineTo(x, y, ctx) {
        if (!ctx)
            ctx = this.ctx;
        ctx.lineTo(this.getSharpPixel(Math.round(x), ctx), this.getSharpPixel(Math.round(y), ctx));
    }
    rect(x, y, w, h, ctx) {
        if (!ctx)
            ctx = this.ctx;
        ctx.rect(this.getSharpPixel(Math.round(x) + 0.5, ctx), this.getSharpPixel(Math.round(y) + 0.5, ctx), this.getSharpPixel(Math.round(w) + 0.5, ctx), this.getSharpPixel(Math.round(h) + 0.5, ctx));
    }
    circle(x, y, radius, ctx) {
        if (!ctx)
            ctx = this.ctx;
        ctx.beginPath();
        x = this.getSharpPixel(Math.round(x) + 0.5, ctx);
        y = this.getSharpPixel(Math.round(y) + 0.5, ctx);
        ctx.arc(x, y, radius, 0, 2 * Math.PI, false);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
    }
    clear(ctx) {
        if (!ctx)
            ctx = this.ctx;
        ctx.clearRect(0, 0, this.getWidth(ctx), this.getHeight(ctx));
    }
    error(msg) {
        throw new Error('CryptoView Error: ' + msg);
    }
    log(...msg) {
        console.log('CryptoView Log: ', ...msg);
    }
    debug(text, x, y) {
        this.ctx.fillStyle = 'white';
        this.ctx.font = '12px Arial';
        this.ctx.fillText(text, x, y);
    }
    draw() {
        this.clear(this.ctx);
        if (!this.history) {
            this.loading(true);
        }
        else {
            this.drawGridColumns();
            this.drawGridRows();
            this.timeAxis.update();
            this.priceAxis.update();
            this.style.draw();
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
}
exports.Chart = Chart;
//# sourceMappingURL=chart.js.map