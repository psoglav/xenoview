import '../public/styles/main.css';
import { Canvas, Chart } from '.';
import { Legend } from '../components';
export declare class ChartLayout {
    chart: Chart;
    layoutContainer: HTMLElement;
    chartContainer: HTMLElement;
    priceContainer: HTMLElement;
    timeContainer: HTMLElement;
    priceAxisCanvas: Canvas;
    timeAxisCanvas: Canvas;
    chartLayers: {
        view?: Canvas;
        ui?: Canvas;
    };
    legend: Legend;
    constructor(chart: Chart, container: HTMLElement | string);
    ctx(canvas: HTMLCanvasElement): CanvasRenderingContext2D;
    create(container: HTMLElement | string): void;
    createChartContainer(): void;
    createPriceContainer(): void;
    createTimeContainer(): void;
    createGUIContainer(): HTMLElement;
    createContainer(): HTMLElement;
}
