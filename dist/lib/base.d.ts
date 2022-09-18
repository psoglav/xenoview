import { Ticker } from '..';
import { UI } from './ui';
import '../public/styles/main.css';
declare abstract class ChartDataBase {
    history: HistoryData;
    chartData: HistoryData;
    visiblePoints: HistoryData;
    topHistoryPrice: [number, number];
    bottomHistoryPrice: [number, number];
    private chart;
    get chartFullWidth(): number;
    constructor();
    init(chart: Chart): void;
    updatePoint(point: HistoryPoint, value: {
        PRICE: number;
        LASTUPDATE: number;
    }): void;
    updateCurrentPoint(value: any): void;
    /**
     * Get point X position.
     * @param {number | HistoryPoint} value a point or an index of it
     * @returns {number} X position
     */
    getPointX(value: any): number;
    filterVisiblePoints(data: any[]): any[];
    filterVisiblePointsAndCache(): HistoryData;
    normalizeY(value: number): number;
    normalizePoint(point: any): any;
    normalizeData(): HistoryData;
    getTopHistoryPrice(): [number, number];
    getBottomHistoryPrice(): [number, number];
    abstract draw(): void;
}
export default abstract class Chart extends ChartDataBase {
    container: HTMLElement | undefined;
    options: ChartOptions;
    ticker: Ticker;
    ui: UI;
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
    focusedPoint: HistoryPoint;
    constructor(container: HTMLElement | string, options?: ChartOptions);
    loadHistory(value: HistoryData): void;
    setTicker(ticker: Ticker): void;
    createChart(): HTMLCanvasElement;
    createXAxis(): HTMLCanvasElement;
    createYAxis(): HTMLCanvasElement;
    createChartLayout(container: HTMLElement | string): void;
    initUIElements(): void;
    abstract clampXPanning(): void;
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
    setSize(w: number, h: number, canvas: HTMLCanvasElement): void;
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
