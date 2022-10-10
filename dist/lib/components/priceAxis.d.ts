import { Chart, Component } from '../core';
export default class PriceAxis extends Component {
    canvas: HTMLCanvasElement;
    get ctx(): CanvasRenderingContext2D;
    isZooming: boolean;
    constructor(chart: Chart);
    bindEventListeners(): void;
    createCanvas(): void;
    drawLabels(): void;
    drawPriceMarker(): void;
    drawCurrentMarketPriceMarker(): void;
    zoom(dy: number): void;
    update(): void;
}
