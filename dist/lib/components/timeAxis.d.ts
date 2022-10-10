import { Chart } from '../core/chart';
import { Component } from '../core/component';
export default class TimeAxis extends Component {
    canvas: HTMLCanvasElement;
    get ctx(): CanvasRenderingContext2D;
    isZooming: boolean;
    constructor(chart: Chart);
    bindEventListeners(): void;
    createCanvas(): void;
    drawLabels(): void;
    drawTimeMarker(): void;
    zoom(dx: number): void;
    update(): void;
}
