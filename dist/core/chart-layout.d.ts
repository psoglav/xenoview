import '../public/styles/main.css';
import { Canvas, Chart } from '.';
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
    constructor(chart: Chart, container: HTMLElement | string);
    ctx(canvas: HTMLCanvasElement): CanvasRenderingContext2D;
    create(container: HTMLElement | string): void;
    createChartContainer(): void;
    createPriceContainer(): void;
    createTimeContainer(): void;
    createLegendContainer(): HTMLElement;
    createContainer(): HTMLElement;
}
