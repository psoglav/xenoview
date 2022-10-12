import { Chart, Component } from '../core';
export default class PriceAxis extends Component {
    canvas: HTMLCanvasElement;
    get ctx(): CanvasRenderingContext2D;
    isZooming: boolean;
    constructor(chart: Chart);
    bindEventListeners(): void;
    createCanvas(): void;
    drawGridLabels(): void;
    drawPointerPrice(): void;
    drawLastVisiblePrice(): void;
    drawLastPrice(): void;
    drawLabel(text: any, y: number, fgColor: string, bgColor?: string, fill?: boolean): void;
    zoom(dy: number): void;
    update(): void;
}
