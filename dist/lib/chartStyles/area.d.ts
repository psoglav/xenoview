import { Chart, ChartStyle } from '../core';
export declare class Area extends ChartStyle {
    bars: boolean;
    constructor(chart: Chart);
    draw(): void;
    drawLivePoint(): void;
    drawLine(): void;
    drawArea(): void;
}
