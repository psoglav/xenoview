import { Chart, Component } from '../core';
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
