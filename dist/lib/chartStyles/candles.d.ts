import { Chart, ChartStyle } from '../core';
export declare class Candles extends ChartStyle {
    bars: boolean;
    empty: boolean;
    constructor(chart: Chart);
    draw(): void;
    drawCandles(): void;
    drawCandleStick(x: number, top: number, bottom: number, type: string): void;
    drawCandleBody(x: number, y: number, width: number, height: number, type: string): void;
}
