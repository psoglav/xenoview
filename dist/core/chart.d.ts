import Configurable from '@/models/configurable';
import { ChartData, ChartLayout, Transform } from '.';
import { ChartStyle, Pointer, Trading } from '../components';
import { ChartOptions } from '../config/chart-options';
export declare class Chart extends ChartData implements Configurable<ChartOptions> {
    _opts: ChartOptions;
    layout: ChartLayout;
    focusedVElement: number;
    get options(): ChartOptions;
    get chartLayer(): import("./canvas").Canvas;
    get uiLayer(): import("./canvas").Canvas;
    transform: Transform;
    mouse: {
        x: number;
        y: number;
        cursor: string;
        isBlockedByUI: boolean;
        DEFAULT_CURSOR: string;
    };
    loader: {
        isActive: boolean;
    };
    get ctx(): CanvasRenderingContext2D;
    get canvas(): HTMLCanvasElement;
    get container(): HTMLElement;
    get boundingRect(): Chart.BoundingRect;
    set boundingRect(value: Chart.BoundingRect);
    get components(): {
        [x: string]: import("./component").Component;
    };
    get style(): ChartStyle;
    get pointer(): Pointer;
    get trading(): Trading;
    constructor(container: HTMLElement | string, options?: ChartOptions);
    applyOptions(opts: ChartOptions): void;
    private render;
    loadHistory(value: History.Data): void;
    setStyle(value: Chart.StyleName): void;
    loading(value: boolean | Promise<any>): void;
    private bindEventListeners;
    get canvasRect(): DOMRect;
    toggleAutoScale(): void;
    on(event: ChartEventType, listener: (e: CustomEvent) => void): void;
    private _debug;
}
