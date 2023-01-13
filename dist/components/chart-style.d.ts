import { Chart, Canvas } from '../core';
import { Component } from '../core/component';
export default abstract class ChartStyle extends Component {
    style: Chart.StyleName;
    abstract bars: boolean;
    constructor();
}
export declare function createChartStyle(chart: Chart): ChartStyle;
export declare class Line extends ChartStyle {
    bars: boolean;
    constructor();
    update(canvas: Canvas): void;
    drawLivePoint(canvas: Canvas): void;
    drawLine(canvas: Canvas): void;
}
export declare class Candles extends ChartStyle {
    bars: boolean;
    empty: boolean;
    constructor();
    update(canvas: Canvas): void;
    drawCandles(canvas: Canvas): void;
    drawCandleStick(x: number, top: number, bottom: number, type: string, canvas: Canvas): void;
    drawCandleBody(x: number, y: number, width: number, height: number, type: string, canvas: Canvas): void;
}
export declare class Area extends Line {
    bars: boolean;
    constructor();
    update(canvas: Canvas): void;
    drawArea(canvas: Canvas): void;
}
export declare class Bars extends Candles {
    bars: boolean;
    constructor();
    drawCandleBody(x: number, y: number, width: number, height: number, type: string, canvas: Canvas): void;
}
export declare class HollowCandles extends Candles {
    bars: boolean;
    constructor();
    drawCandleBody(x: number, y: number, width: number, height: number, type: string): void;
}
