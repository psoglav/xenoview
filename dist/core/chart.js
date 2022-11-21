import { ChartData, ChartLayout, Label, Transform, UIElementGroup } from '.';
import { Loader } from '../components';
import { createChartStyle } from '../components/chart-style';
import { defaultChartOptions } from '../config/chart-options';
export class Chart extends ChartData {
    constructor(container, options) {
        super();
        this._opts = defaultChartOptions;
        this.mousePosition = { x: 0, y: 0 };
        this.applyOptions(options);
        this.initData(this);
        this.layout = new ChartLayout(this, container);
        this.transform = new Transform(this);
        this.loader = new Loader(this);
        this.bindEventListeners();
        this.render();
    }
    get options() {
        return this._opts;
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
    applyOptions(opts) {
        Object.keys(opts).forEach(option => {
            this._opts[option] = opts[option];
        });
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
    setStyle(value) {
        this.options.style = value;
        this.chartLayer.components.style = createChartStyle(this);
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
                ctx: this.ctx
            });
        };
        let topbarGroup = new UIElementGroup({
            x: 10,
            y: 23,
            gap: 2,
            elements: [
                new Label(Object.assign(Object.assign({ value: () => { var _a; return ((_a = this.dataProvider) === null || _a === void 0 ? void 0 : _a.currency) + ' / TetherUS - BINANCE - CryptoView'; } }, commonOpts()), { size: 17 })),
                30,
                new Label(Object.assign({ value: 'O' }, commonOpts())),
                new Label(Object.assign(Object.assign({ value: () => getPoint().open }, commonOpts()), { color: getCandleColor })),
                10,
                new Label(Object.assign({ value: 'H' }, commonOpts())),
                new Label(Object.assign(Object.assign({ value: () => getPoint().high }, commonOpts()), { color: getCandleColor })),
                10,
                new Label(Object.assign({ value: 'L' }, commonOpts())),
                new Label(Object.assign(Object.assign({ value: () => getPoint().low }, commonOpts()), { color: getCandleColor })),
                10,
                new Label(Object.assign({ value: 'C' }, commonOpts())),
                new Label(Object.assign(Object.assign({ value: () => getPoint().close }, commonOpts()), { color: getCandleColor }))
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
    get canvasRect() {
        return this.ctx.canvas.getBoundingClientRect();
    }
    toggleAutoScale() {
        this.options.autoScale = !this.options.autoScale;
        if (this.options.autoScale) {
            this.boundingRect.top = 0;
            this.boundingRect.bottom = this.chartLayer.height;
        }
    }
    debug(text, x, y) {
        this.ctx.fillStyle = 'white';
        this.ctx.font = '12px Arial';
        this.ctx.fillText(text, x, y);
    }
}
