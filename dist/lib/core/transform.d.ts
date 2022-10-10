import { Chart } from '@/lib/core';
export declare class Transform {
    boundingRect: Chart.BoundingRect;
    chart: Chart;
    ZOOM_RATE: number;
    constructor(chart: Chart);
    move(mx: number, my: number): void;
    zoom(dx: number, dy: number): void;
    reset(full?: boolean): void;
    clamp(): void;
}
