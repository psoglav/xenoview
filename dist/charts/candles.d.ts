import { TCandlesHistory, ChartOptions } from '../types';
import Chart from './base';
export declare class CandlesChart extends Chart {
    private pointerYPosIndex;
    private pointerIsVisible;
    private panningIsActive;
    private candlesSpace;
    private yZoomFactor;
    private isZoomingYAxis;
    private isZoomingXAxis;
    private mousePosition;
    private history;
    private chartData;
    private visibleData;
    private topHistoryPrice;
    private bottomHistoryPrice;
    constructor(container: HTMLElement | string, data?: TCandlesHistory, options?: ChartOptions);
    getTopHistoryPrice(): [number, number];
    getBottomHistoryPrice(): [number, number];
    getStartDataPoint(): any;
    getEndDataPoint(): any;
    get floatingWidth(): number;
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
    zoomYAxis(side: number): void;
    zoomChart(side: number): void;
    moveChart(movement: number): void;
    clampXPanning(): void;
    filterVisiblePointsAndCache(): any;
    filterVisiblePoints(data: any[]): any[];
    movePointer(): void;
    draw(): void;
    drawPointer(): void;
    drawPricePointer(): void;
    mainDebug(): void;
    drawXAxis(): void;
    drawYAxis(): void;
    drawChart(): void;
    loadHistory(data: TCandlesHistory): void;
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
