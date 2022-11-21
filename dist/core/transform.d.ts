import { Chart } from '@/core';
export declare class Transform {
    boundingRect: Chart.BoundingRect;
    isPanning: boolean;
    chart: Chart;
    ZOOM_RATE: number;
    constructor(chart: Chart);
    move(mx: number, my: number): void;
    zoom(dx: number, dy: number, xOrigin?: number): void;
    reset(full?: boolean): void;
    clamp(): void;
}
