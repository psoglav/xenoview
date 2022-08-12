import { ChartBoundingRect, ChartOptions, HistoryData, HistoryPoint } from '../types';
declare abstract class ChartDataBase {
    history: HistoryData;
    chartData: HistoryData;
    visiblePoints: HistoryData;
    topHistoryPrice: [number, number];
    bottomHistoryPrice: [number, number];
    abstract yZoomFactor: number;
    abstract position: ChartBoundingRect;
    abstract get mainCanvasWidth(): number;
    abstract get mainCanvasHeight(): number;
    get chartFullWidth(): number;
    constructor();
    loadHistory(value: HistoryData): void;
    updatePoint(point: HistoryPoint, value: {
        PRICE: any;
        LASTUPDATE: any;
    }): void;
    updateCurrentPoint(value: {
        PRICE: any;
        LASTUPDATE: any;
    }): void;
    /**
     * Get point X position.
     * @param {number | HistoryPoint} value a point or an index of it
     * @returns {number} X position
     */
    getPointX(value: any): number;
    filterVisiblePoints(data: any[]): any[];
    filterVisiblePointsAndCache(): HistoryData;
    normalizePoint(point: any): any;
    normalizeData(): HistoryData;
    getTopHistoryPrice(): [number, number];
    getBottomHistoryPrice(): [number, number];
    abstract draw(): void;
}
export default abstract class Chart extends ChartDataBase {
    container: HTMLElement | undefined;
    options: ChartOptions;
    position: ChartBoundingRect;
    mousePosition: {
        x: number;
        y: number;
    };
    chartContext: CanvasRenderingContext2D;
    yAxisContext: CanvasRenderingContext2D;
    xAxisContext: CanvasRenderingContext2D;
    zoomSpeed: number;
    yZoomFactor: number;
    constructor(container: HTMLElement | string, options?: ChartOptions);
    createChart(): HTMLCanvasElement;
    createXAxis(): HTMLCanvasElement;
    createYAxis(): HTMLCanvasElement;
    createChartMarkup(): void;
    abstract windowMouseMoveHandler(e?: MouseEvent): void;
    abstract windowMouseUpHandler(e?: MouseEvent): void;
    abstract mouseMoveHandler(e?: MouseEvent): void;
    abstract mouseLeaveHandler(e?: MouseEvent): void;
    abstract mouseEnterHandler(e?: MouseEvent): void;
    abstract mouseDownHandler(e?: MouseEvent): void;
    abstract mouseUpHandler(e?: MouseEvent): void;
    abstract wheelHandler(e?: WheelEvent): void;
    abstract yAxisMouseMoveHandler(e?: MouseEvent): void;
    abstract yAxisMouseDownHandler(e?: MouseEvent): void;
    abstract yAxisMouseUpHandler(e?: MouseEvent): void;
    abstract xAxisMouseDownHandler(e?: MouseEvent): void;
    abstract xAxisMouseUpHandler(e?: MouseEvent): void;
    bindMouseListeners(): void;
    bindYAxisListeners(): void;
    bindXAxisListeners(): void;
    getWidth(ctx: CanvasRenderingContext2D): number;
    getHeight(ctx: CanvasRenderingContext2D): number;
    get mainCanvasWidth(): number;
    get mainCanvasHeight(): number;
    get canvasRect(): DOMRect;
    setSize(w: number, h: number): void;
    rescale(ctx: CanvasRenderingContext2D): void;
    getSharpPixel(pos: number, ctx: CanvasRenderingContext2D, thickness?: number): number;
    getPixelRatio(context: any): number;
    moveTo(x: number, y: number, ctx: CanvasRenderingContext2D): void;
    lineTo(x: number, y: number, ctx: CanvasRenderingContext2D): void;
    rect(x: number, y: number, w: number, h: number, ctx: CanvasRenderingContext2D): void;
    clear(ctx: CanvasRenderingContext2D): void;
    error(msg: string): void;
    log(...msg: any): void;
    debug(text: any, x: number, y: number): void;
}
export {};
