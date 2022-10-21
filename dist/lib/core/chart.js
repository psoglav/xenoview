"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Chart = void 0;
const components_1 = require("../components");
const _1 = require(".");
const chartStyle_1 = require("../components/chartStyle");
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
        this.layout = new _1.ChartLayout(this, container);
        this.transform = new _1.Transform(this);
        this.loader = new components_1.Loader(this);
        this.bindEventListeners();
        this.render();
    }
    get chartLayer() {
        return this.layout.chartLayers.view;
    }
    get uiLayer() {
        return this.layout.chartLayers.ui;
    }
    get ctx() {
        return this.chartLayer.ctx;
    }
    get canvas() {
        return this.chartLayer.canvas;
    }
    get container() {
        return this.layout.layoutContainer;
    }
    get boundingRect() {
        return this.transform.boundingRect;
    }
    set boundingRect(value) {
        this.transform.boundingRect = value;
    }
    get components() {
        return Object.assign(Object.assign({}, this.uiLayer.components), this.chartLayer.components);
    }
    get style() {
        return this.chartLayer.components.style;
    }
    get pointer() {
        return this.components.pointer;
    }
    render() {
        if (this.options.autoScale) {
            this.getHighestAndLowestPrice();
        }
        if (!this.history) {
            this.loading(true);
        }
        else {
            this.chartLayer.update();
            this.uiLayer.update();
            this.layout.priceAxisCanvas.update();
            this.layout.timeAxisCanvas.update();
        }
        requestAnimationFrame(this.render.bind(this));
    }
    loadHistory(value) {
        this.transform.reset();
        this.history = value;
        this.chartData = this.normalizeData();
        this.loading(false);
        this.getHighestAndLowestPrice();
        this.chartLayer.needsUpdate = true;
    }
    setTicker(ticker) {
        this.ticker = ticker;
        setInterval(() => {
            this.updateCurrentPoint(ticker.state);
        }, 500);
    }
    setStyle(value) {
        this.options.style = value;
        this.chartLayer.components.style = (0, chartStyle_1.createChartStyle)(this);
        this.chartLayer.needsUpdate = true;
    }
    loading(value) {
        this.loader.isActive = value;
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
            this.uiLayer.update();
        });
        window.addEventListener('mouseup', e => {
            if (e.button == 0) {
                this.transform.isPanning = false;
            }
        });
        this.canvas.addEventListener('wheel', (e) => {
            this.transform.zoom(e.wheelDeltaY, e.altKey ? -e.wheelDeltaY / 2 : 0, e.ctrlKey ? this.mousePosition.x : null);
            this.pointer.move();
        });
    }
    getWidth(ctx) {
        return ctx.canvas.width * this.getPixelRatio(ctx);
    }
    getHeight(ctx) {
        return ctx.canvas.height * this.getPixelRatio(ctx);
    }
    get mainCanvasWidth() {
        return this.canvas.clientWidth;
    }
    get mainCanvasHeight() {
        return this.canvas.clientHeight;
    }
    get canvasRect() {
        return this.ctx.canvas.getBoundingClientRect();
    }
    toggleAutoScale() {
        this.options.autoScale = !this.options.autoScale;
        if (this.options.autoScale) {
            this.boundingRect.top = 0;
            this.boundingRect.bottom = this.mainCanvasHeight;
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
}
exports.Chart = Chart;
//# sourceMappingURL=chart.js.map