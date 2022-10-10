import { Chart } from '../core/chart';
export declare class CandlesChart extends Chart {
    private panningIsActive;
    constructor(container: HTMLElement | string, options?: Chart.Options);
    draw(): void;
    drawGridRows(): void;
    drawGridColumns(): void;
    drawChart(): void;
    windowMouseMoveHandler(e: MouseEvent): void;
    mouseMoveHandler(e: MouseEvent): void;
    mouseEnterHandler(): void;
    mouseLeaveHandler(): void;
    mouseDownHandler(e: MouseEvent): void;
    mouseUpHandler(e: MouseEvent): void;
    wheelHandler(e: any): void;
}
