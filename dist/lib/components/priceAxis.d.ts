import { Canvas, Chart, Component } from '../core';
export default class PriceAxis extends Component {
    isZooming: boolean;
    constructor(chart: Chart);
    drawGridLabels(ctx: CanvasRenderingContext2D): void;
    drawPointerPrice(ctx: CanvasRenderingContext2D): void;
    drawLastVisiblePrice(ctx: CanvasRenderingContext2D): void;
    drawLastPrice(ctx: CanvasRenderingContext2D): void;
    drawLabel(text: any, y: number, ctx: CanvasRenderingContext2D, fgColor: string, bgColor?: string, fill?: boolean): void;
    zoom(dy: number): void;
    update(canvas: Canvas): void;
}
