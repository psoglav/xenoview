"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChartLayout = void 0;
const _1 = require(".");
const components_1 = require("../components");
const chartStyle_1 = require("../components/chartStyle");
class ChartLayout {
    constructor(chart, container) {
        this.chartLayers = {};
        this.chart = chart;
        this.create(container);
    }
    ctx(canvas) {
        return canvas.getContext('2d');
    }
    create(container) {
        if (typeof container === 'string') {
            this.layoutContainer = document.querySelector(container);
        }
        if (!this.layoutContainer) {
            this.chart.error('no container is found');
        }
        else {
            this.layoutContainer.classList.add('chart-container');
            this.layoutContainer.innerHTML = '';
            this.layoutContainer.style.display = 'grid';
            this.layoutContainer.style.position = 'absolute';
            this.layoutContainer.style.top = '0';
            this.layoutContainer.style.left = '0';
            this.layoutContainer.style.grid = '1fr 28px / 1fr 70px';
            this.createChartContainer();
            this.createPriceContainer();
            this.createTimeContainer();
        }
    }
    createChartContainer() {
        const el = this.createContainer();
        this.chartContainer = el;
        el.style.gridArea = '1 / 1 / 2 / 2';
        el.style.width = '100%';
        el.style.height = '100%';
        el.style.cursor = 'crosshair';
        this.chartLayers.view = new _1.Canvas({
            container: el,
            zIndex: 0,
            updateByRequest: true,
            components: {
                grid: new components_1.Grid(this.chart),
                style: (0, chartStyle_1.createChartStyle)(this.chart)
            }
        });
        this.chartLayers.ui = new _1.Canvas({
            container: el,
            zIndex: 1,
            components: {
                pointer: new components_1.Pointer(this.chart)
            }
        });
        this.chartLayers.ui.canvas.style.pointerEvents = 'none';
        const observer = new ResizeObserver(() => {
            if (!this.chart.transform)
                return;
            this.chart.transform.clamp();
        });
        observer.observe(el);
    }
    createPriceContainer() {
        const el = this.createContainer();
        el.style.gridArea = '1 / 2 / 2 / 3';
        el.style.width = '70px';
        el.style.height = '100%';
        el.style.cursor = 'n-resize';
        this.priceContainer = el;
        const priceAxis = new components_1.PriceAxis(this.chart);
        this.priceAxisCanvas = new _1.Canvas({
            container: el,
            // updateByRequest: true,
            components: {
                priceAxis
            }
        });
        el.addEventListener('mousedown', () => (priceAxis.isZooming = true));
        el.addEventListener('mouseup', () => (priceAxis.isZooming = false));
        window.addEventListener('mousemove', e => priceAxis.zoom(e === null || e === void 0 ? void 0 : e.movementY));
        window.addEventListener('mouseup', () => (priceAxis.isZooming = false));
        window.addEventListener('resize', () => {
            let rect = el.getBoundingClientRect();
            this.chart.setSize(70, rect.height - 28, this.priceAxisCanvas.raw);
        });
    }
    createTimeContainer() {
        const el = this.createContainer();
        el.style.gridArea = '2 / 1 / 3 / 3';
        el.style.width = 'calc(100% - 70px)';
        el.style.height = '28px';
        el.style.cursor = 'e-resize';
        this.timeContainer = el;
        const timeAxis = new components_1.TimeAxis(this.chart);
        this.timeAxisCanvas = new _1.Canvas({
            container: el,
            components: {
                timeAxis
            }
        });
        el.addEventListener('mousedown', () => (timeAxis.isZooming = true));
        el.addEventListener('mouseup', () => (timeAxis.isZooming = false));
        window.addEventListener('mousemove', (e) => timeAxis.zoom(e.movementX));
        window.addEventListener('mouseup', () => (timeAxis.isZooming = false));
        window.addEventListener('resize', () => {
            let rect = el.getBoundingClientRect();
            this.chart.setSize(rect.width - 70, 28, this.timeAxisCanvas.canvas);
        });
    }
    createContainer() {
        const el = document.createElement('div');
        el.style.position = 'relative';
        this.layoutContainer.appendChild(el);
        return el;
    }
}
exports.ChartLayout = ChartLayout;
//# sourceMappingURL=chartLayout.js.map