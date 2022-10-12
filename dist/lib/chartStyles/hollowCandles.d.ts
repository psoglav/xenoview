import { Chart } from '../core';
import { Candles } from './candles';
export declare class HollowCandles extends Candles {
    bars: boolean;
    constructor(chart: Chart);
    drawCandleBody(x: number, y: number, width: number, height: number, type: string): void;
}
