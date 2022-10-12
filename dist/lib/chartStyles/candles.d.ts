import { Chart, ChartStyle } from '../core';
export declare class Candles extends ChartStyle {
    bars: boolean;
    constructor(chart: Chart);
    draw(): void;
}
