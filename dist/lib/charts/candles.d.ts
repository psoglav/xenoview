import { Chart } from '../core/chart';
export declare class CandlesChart extends Chart {
    private panningIsActive;
    private isZoomingTimeAxis;
    constructor(container: HTMLElement | string, options?: Chart.Options);
    draw(): void;
    zoomChart(side: number): void;
    moveChart(mx: number, my: number): void;
    clampXPanning(): void;
    movePointer(): void;
    drawCurrentMarketPriceMarker(): void;
    drawTimeMarker(): void;
    getGridColumns(): number[];
    drawGridRows(): void;
    drawGridColumns(): void;
    drawTimeAxisLabels(): void;
    drawPriceAxis(): void;
    drawChart(): void;
    zoomPriceAxis(dy: number): void;
    zoomTimeAxis(mx: any): void;
    windowMouseMoveHandler(e: MouseEvent): void;
    windowMouseUpHandler(e: MouseEvent): void;
    mouseMoveHandler(e: MouseEvent): void;
    mouseEnterHandler(): void;
    mouseLeaveHandler(): void;
    mouseDownHandler(e: MouseEvent): void;
    mouseUpHandler(e: MouseEvent): void;
    wheelHandler(e: any): void;
    timeAxisMouseDownHandler(e?: MouseEvent): void;
    timeAxisMouseUpHandler(e?: MouseEvent): void;
    mainDebug(): void;
}
