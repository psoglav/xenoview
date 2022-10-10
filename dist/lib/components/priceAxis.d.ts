import { Chart } from '../core/chart';
import { Component } from '../core/component';
export default class PriceAxis extends Component {
    canvas: HTMLCanvasElement;
    get ctx(): CanvasRenderingContext2D;
    isZooming: boolean;
    constructor(chart: Chart);
    bindEventListeners(): void;
    createCanvas(): void;
    drawLabels(): void;
    drawPriceMarker(): void;
    update(): void;
}
