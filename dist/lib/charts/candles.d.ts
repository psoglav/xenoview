import { Chart } from '../core/chart';
export declare class CandlesChart extends Chart {
    constructor(container: HTMLElement | string, options?: Chart.Options);
    draw(): void;
    drawGridRows(): void;
    drawGridColumns(): void;
    drawChart(): void;
}
