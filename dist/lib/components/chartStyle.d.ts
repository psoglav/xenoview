import { Chart } from '../core';
import { Component } from '../core/component';
export default abstract class ChartStyle extends Component {
    style: Chart.StyleName;
    abstract bars: boolean;
    constructor(chart: Chart);
}
export declare function createChartStyle(chart: Chart): ChartStyle;
export declare class Line extends ChartStyle {
    bars: boolean;
    constructor(chart: Chart);
    update(): void;
    drawLivePoint(): void;
    drawLine(): void;
}
export declare class Candles extends ChartStyle {
    bars: boolean;
    empty: boolean;
    constructor(chart: Chart);
    update(): void;
    drawCandles(): void;
    drawCandleStick(x: number, top: number, bottom: number, type: string): void;
    drawCandleBody(x: number, y: number, width: number, height: number, type: string): void;
}
export declare class Area extends Line {
    bars: boolean;
    constructor(chart: Chart);
    update(): void;
    drawArea(): void;
}
export declare class Bars extends Candles {
    bars: boolean;
    constructor(chart: Chart);
    drawCandleBody(x: number, y: number, width: number, height: number): void;
}
export declare class HollowCandles extends Candles {
    bars: boolean;
    constructor(chart: Chart);
    drawCandleBody(x: number, y: number, width: number, height: number, type: string): void;
}
