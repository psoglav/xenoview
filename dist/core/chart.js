import { ChartData, ChartLayout, Transform, EventEmitter } from '.';
import { createLoader } from './gui';
import { createChartStyle } from '../components/chart-style';
import { defaultChartOptions } from '../config/chart-options';
export class Chart extends ChartData {
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
    get trading() {
        return this.components.trading;
    }
    constructor(container, options) {
        super();
        this._opts = defaultChartOptions;
        this.mouse = new Proxy({ x: 0, y: 0, cursor: 'default', isBlockedByUI: false, DEFAULT_CURSOR: 'default' }, {
            set(target, prop, value) {
                if (prop == 'cursor') {
                    document.body.style.cursor = value;
                }
                else if (prop == 'isBlockedByUI') {
                    const el = document.querySelector('.chart-layout__chart-container');
                    el.classList[value ? 'add' : 'remove']('blocked-by-ui');
                }
                // @ts-ignore
                return Reflect.set(...arguments);
            }
        });
        window.xenoview = this;
        this.applyOptions(options);
        this.initData(this);
        this.layout = new ChartLayout(this, container);
        this.transform = new Transform(this);
        this.loader = createLoader({
            color: this.options.spinnerColor,
            container: this.container
        });
        this.bindEventListeners();
        this.render();
        EventEmitter.dispatch('mounted', null);
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
        if (typeof value === 'boolean') {
            this.loader.isActive = value;
        }
        else {
            this.loader.isActive = true;
            value.finally(() => {
                this.loader.isActive = false;
            });
        }
    }
    bindEventListeners() {
        this.uiLayer.canvas.addEventListener('mouseenter', () => {
            this.pointer.isVisible = true;
        });
        this.uiLayer.canvas.addEventListener('mouseleave', () => {
            this.pointer.isVisible = false;
        });
        this.uiLayer.canvas.addEventListener('mousedown', e => {
            if (e.button == 0 && !this.mouse.isBlockedByUI) {
                e.preventDefault();
                this.transform.isPanning = true;
            }
        });
        window.addEventListener('mousemove', e => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
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
        this.uiLayer.canvas.addEventListener('wheel', (e) => {
            this.transform.zoom(e.wheelDeltaY, e.altKey ? -e.wheelDeltaY / 2 : 0, e.ctrlKey ? this.mouse.x : null);
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
    on(event, listener) {
        EventEmitter.on(event, listener);
    }
    _debug(text, x, y) {
        this.ctx.fillStyle = 'white';
        this.ctx.font = '12px Arial';
        this.ctx.fillText(text, x, y);
    }
}
