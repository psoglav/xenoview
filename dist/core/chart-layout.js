import '../public/styles/main.css';
import { Canvas } from '.';
import { Grid, Pointer, PriceAxis, TimeAxis, Legend, Trading, Prompt, PlaceOrderButton } from '../components';
import { createChartStyle } from '../components/chart-style';
export class ChartLayout {
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
            throw new Error('no container is found');
        }
        else {
            this.layoutContainer.classList.add('chart-layout');
            this.layoutContainer.innerHTML = '';
            this.createChartContainer();
            this.createPriceContainer();
            this.createTimeContainer();
            this.createGUIContainer();
        }
    }
    createChartContainer() {
        const el = this.createContainer();
        el.classList.add('chart-layout__chart-container');
        this.chartContainer = el;
        this.chartLayers.view = new Canvas({
            container: el,
            zIndex: 0,
            // updateByRequest: true,
            components: {
                grid: new Grid(),
                style: createChartStyle(this.chart)
            }
        });
        this.chartLayers.ui = new Canvas({
            container: el,
            zIndex: 1,
            components: {
                prompt: new Prompt(),
                pointer: new Pointer(),
                'place-order-button': new PlaceOrderButton(),
                trading: new Trading()
            }
        });
        this.chartLayers.view.canvas.style.pointerEvents = 'none';
        const observer = new ResizeObserver(() => {
            if (!this.chart.transform)
                return;
            this.chart.transform.clamp();
        });
        observer.observe(el);
    }
    createPriceContainer() {
        const el = this.createContainer();
        el.classList.add('chart-layout__price-scale-container');
        this.priceContainer = el;
        const priceAxis = new PriceAxis();
        this.priceAxisCanvas = new Canvas({
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
            this.priceAxisCanvas.setSize(this.priceAxisCanvas.width, rect.height - this.timeAxisCanvas.height);
        });
    }
    createTimeContainer() {
        const el = this.createContainer();
        el.classList.add('chart-layout__time-scale-container');
        this.timeContainer = el;
        const timeAxis = new TimeAxis();
        this.timeAxisCanvas = new Canvas({
            container: el,
            components: {
                timeAxis
            }
        });
        el.addEventListener('mousedown', () => (timeAxis.isZooming = true));
        el.addEventListener('mouseup', () => (timeAxis.isZooming = false));
        window.addEventListener('mousemove', e => timeAxis.zoom(e.movementX));
        window.addEventListener('mouseup', () => (timeAxis.isZooming = false));
        window.addEventListener('resize', () => {
            let rect = el.getBoundingClientRect();
            this.timeAxisCanvas.setSize(rect.width, this.timeAxisCanvas.height);
        });
    }
    createGUIContainer() {
        const el = this.createContainer();
        const legendNode = document.createElement('div');
        this.legend = new Legend(legendNode, this.chart, this.chart._opts.legend);
        el.classList.add('chart-layout__gui-wrapper');
        legendNode.classList.add('legend');
        el.appendChild(legendNode);
        return el;
    }
    createContainer() {
        const el = document.createElement('div');
        this.layoutContainer.appendChild(el);
        return el;
    }
}
