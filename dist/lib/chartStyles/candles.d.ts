import { Chart, ChartStyle } from '../core';
export declare class Candles extends ChartStyle {
    bars: boolean;
    constructor(chart: Chart);
    draw(): void;
    drawCandles(): void;
    drawCandleStick(x: number, top: number, bottom: number, color: string): void;
    drawCandleBody(left: number, top: number, right: number, bottom: number, color: string): void;
}
