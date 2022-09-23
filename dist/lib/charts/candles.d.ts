import Chart from '../base';
export declare class CandlesChart extends Chart {
    private pointingPointIndex;
    private pointerIsVisible;
    private panningIsActive;
    private candlesSpace;
    private isZoomingPriceAxis;
    private isZoomingTimeAxis;
    constructor(container: HTMLElement | string, options?: ChartOptions);
    draw(): void;
    zoomChart(side: number): void;
    moveChart(mx: number, my: number): void;
    clampXPanning(): void;
    movePointer(): void;
    loading(): void;
    drawPointer(): void;
    drawCurrentMarketPriceMarker(): void;
    drawPriceMarker(): void;
    drawTimeMarker(): void;
    getGridRows(): any[];
    getGridColumns(): number[];
    drawGridRows(): void;
    drawGridColumns(): void;
    drawPriceAxisLabels(): void;
    drawTimeAxisLabels(): void;
    drawPriceAxis(): void;
    drawChart(): void;
    zoomPriceAxis(my: any): void;
    zoomTimeAxis(mx: any): void;
    windowMouseMoveHandler(e: MouseEvent): void;
    windowMouseUpHandler(e: MouseEvent): void;
    mouseMoveHandler(e: MouseEvent): void;
    mouseEnterHandler(): void;
    mouseLeaveHandler(): void;
    mouseDownHandler(e: MouseEvent): void;
    mouseUpHandler(e: MouseEvent): void;
    wheelHandler(e: any): void;
    priceAxisMouseDownHandler(e?: MouseEvent): void;
    priceAxisMouseUpHandler(e?: MouseEvent): void;
    timeAxisMouseDownHandler(e?: MouseEvent): void;
    timeAxisMouseUpHandler(e?: MouseEvent): void;
    mainDebug(): void;
}
