import { HistoryData, ChartOptions } from '../types';
import Chart from './base';
export declare class CandlesChart extends Chart {
    private pointerYPosIndex;
    private pointerIsVisible;
    private panningIsActive;
    private candlesSpace;
    private yZoomFactor;
    private isZoomingYAxis;
    private isZoomingXAxis;
    private history;
    private chartData;
    private visibleData;
    private topHistoryPrice;
    private bottomHistoryPrice;
    constructor(container: HTMLElement | string, data?: HistoryData, options?: ChartOptions);
    /**
     * Get point X position.
     * @param {number | HistoryPoint} value a point or an index of it
     * @returns {number} X position
     */
    getPointX(value: any): number;
    getTopHistoryPrice(): [number, number];
    getBottomHistoryPrice(): [number, number];
    get chartFullWidth(): number;
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
    zoomChart(side: number): void;
    moveChart(movement: number): void;
    clampXPanning(): void;
    filterVisiblePointsAndCache(): any;
    filterVisiblePoints(data: any[]): any[];
    movePointer(): void;
    draw(): void;
    drawPointer(): void;
    drawCurrentMarketPriceMarker(): void;
    drawPriceMarker(): void;
    drawTimeMarker(): void;
    mainDebug(): void;
    getGridRows(): void;
    getGridColumns(): number[];
    drawGridColumns(): void;
    drawXAxisLabels(): void;
    drawYAxis(): void;
    drawChart(): void;
    loadHistory(data: HistoryData): void;
    normalizePoint(point: any): any;
    normalizeData(): {
        close: number;
        high: number;
        low: number;
        open: number;
        time: number;
        volumefrom: number;
        volumeto: number;
    }[];
}
