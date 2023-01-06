import Configurable from '@/models/configurable';
import { ChartData, ChartLayout, Transform } from '.';
import { ChartStyle, Loader, Pointer } from '../components';
import { ChartOptions } from '../config/chart-options';
export declare class Chart extends ChartData implements Configurable<ChartOptions> {
    _opts: ChartOptions;
    layout: ChartLayout;
    get options(): ChartOptions;
    get chartLayer(): import("./canvas").Canvas;
    get uiLayer(): import("./canvas").Canvas;
    transform: Transform;
    mousePosition: {
        x: number;
        y: number;
    };
    loader: Loader;
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
    constructor(container: HTMLElement | string, options?: ChartOptions);
    applyOptions(opts: ChartOptions): void;
    private render;
    loadHistory(value: History.Data): void;
    setStyle(value: Chart.StyleName): void;
    loading(value: boolean): void;
    private bindEventListeners;
    get canvasRect(): DOMRect;
    toggleAutoScale(): void;
    private debug;
}
