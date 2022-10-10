import { Ticker } from '../ticker';
import { UI } from '../ui';
import { Pointer, PriceAxis, TimeAxis } from '../components';
import { ChartData } from './chartData';
import '../../public/styles/main.css';
export declare abstract class Chart extends ChartData {
    container: HTMLElement | undefined;
    options: Chart.Options;
    ticker: Ticker;
    ui: UI;
    position: Chart.Position;
    mousePosition: {
        x: number;
        y: number;
    };
    chartContext: CanvasRenderingContext2D;
    spinnerEl: HTMLElement;
    pointer: Pointer;
    priceAxis: PriceAxis;
    timeAxis: TimeAxis;
    zoomSpeed: number;
    yZoomFactor: number;
    focusedPointIndex: number;
    focusedPoint: History.Point | null;
    constructor(container: HTMLElement | string, options?: Chart.Options);
    loadHistory(value: History.Data): void;
    setTicker(ticker: Ticker): void;
    resetChartPosition(full?: boolean): void;
    zoom(dx: number, dy: number): void;
    move(mx: number, my: number): void;
    createChart(): HTMLCanvasElement;
    createChartToolbar(): void;
    createSpinnerSvg(): any;
    loading(value: boolean): void;
    createChartLayout(container: HTMLElement | string): void;
    initUIElements(): void;
    abstract clampXPanning(): void;
    abstract windowMouseMoveHandler(e?: MouseEvent): void;
    abstract mouseMoveHandler(e?: MouseEvent): void;
    abstract mouseLeaveHandler(e?: MouseEvent): void;
    abstract mouseEnterHandler(e?: MouseEvent): void;
    abstract mouseDownHandler(e?: MouseEvent): void;
    abstract mouseUpHandler(e?: MouseEvent): void;
    abstract wheelHandler(e?: WheelEvent): void;
    bindMouseListeners(): void;
    getWidth(ctx: CanvasRenderingContext2D): number;
    getHeight(ctx: CanvasRenderingContext2D): number;
    get mainCanvasWidth(): number;
    get mainCanvasHeight(): number;
    get canvasRect(): DOMRect;
    toggleAutoScale(): void;
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
