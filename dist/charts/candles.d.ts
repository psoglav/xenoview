import { HistoryData, ChartOptions } from '../types';
import Chart from './base';
export declare class CandlesChart extends Chart {
    private pointerYPosIndex;
    private pointerIsVisible;
    private panningIsActive;
    private candlesSpace;
    private isZoomingYAxis;
    private isZoomingXAxis;
    constructor(container: HTMLElement | string, data?: HistoryData, options?: ChartOptions);
    draw(): void;
    zoomChart(side: number): void;
    moveChart(movement: number): void;
    clampXPanning(): void;
    movePointer(): void;
    drawPointer(): void;
    drawCurrentMarketPriceMarker(): void;
    drawPriceMarker(): void;
    drawTimeMarker(): void;
    mainDebug(): void;
    getGridRows(): any[];
    getGridColumns(): number[];
    drawGridRows(): void;
    drawGridColumns(): void;
    drawYAxisLabels(): void;
    drawXAxisLabels(): void;
    drawYAxis(): void;
    drawChart(): void;
    windowMouseMoveHandler(e: MouseEvent): void;
    windowMouseUpHandler(e: MouseEvent): void;
    mouseMoveHandler(e: MouseEvent): void;
    mouseEnterHandler(): void;
    mouseLeaveHandler(): void;
    mouseDownHandler(e: MouseEvent): void;
    mouseUpHandler(e: MouseEvent): void;
    wheelHandler(e: any): void;
    yAxisMouseMoveHandler(e?: MouseEvent): void;
    yAxisMouseDownHandler(e?: MouseEvent): void;
    yAxisMouseUpHandler(e?: MouseEvent): void;
    xAxisMouseDownHandler(e?: MouseEvent): void;
    xAxisMouseUpHandler(e?: MouseEvent): void;
}
