import { Chart, ChartStyle } from '../core';
export declare class Candles extends ChartStyle {
    bars: boolean;
    empty: boolean;
    constructor(chart: Chart);
    draw(): void;
    drawCandles(): void;
    drawCandleStick(x: number, top: number, bottom: number, type: string): void;
    drawCandleBody(left: number, top: number, right: number, bottom: number, type: string): void;
}
