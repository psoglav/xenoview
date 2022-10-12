import { Chart, ChartStyle } from '../core';
export declare class Line extends ChartStyle {
    bars: boolean;
    constructor(chart: Chart);
    draw(): void;
    drawLivePoint(): void;
    drawLine(): void;
}
