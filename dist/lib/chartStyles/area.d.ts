import { Chart } from '../core';
import { Line } from './line';
export declare class Area extends Line {
    bars: boolean;
    constructor(chart: Chart);
    draw(): void;
    drawArea(): void;
}
