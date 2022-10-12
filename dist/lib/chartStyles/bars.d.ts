import { Chart } from '../core';
import { Candles } from './candles';
export declare class Bars extends Candles {
    bars: boolean;
    constructor(chart: Chart);
    drawCandleBody(left: number, top: number, right: number, bottom: number): void;
}
