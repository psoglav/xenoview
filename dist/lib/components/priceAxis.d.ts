import { Chart, Component } from '../core';
export default class PriceAxis extends Component {
    canvas: HTMLCanvasElement;
    get ctx(): CanvasRenderingContext2D;
    isZooming: boolean;
    constructor(chart: Chart);
    bindEventListeners(): void;
    createCanvas(): void;
    drawLabels(): void;
    drawPriceLabel(): void;
    drawCurrentMarketPriceLabel(): void;
    drawLabel(text: any, y: number, fgColor: string, bgColor?: string, fill?: boolean): void;
    zoom(dy: number): void;
    update(): void;
}
