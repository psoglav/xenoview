import { Canvas, Component } from '../core';
export default class PriceAxis extends Component {
    isZooming: boolean;
    constructor();
    update(canvas: Canvas): void;
    drawGridLabels(canvas: Canvas): void;
    drawPointerPrice(canvas: Canvas): void;
    drawLastVisiblePrice(canvas: Canvas): void;
    drawLastPrice(canvas: Canvas): void;
    drawOrdersPrice(canvas: Canvas): void;
    drawLabel(text: any, y: number, canvas: Canvas, fgColor: string, bgColor?: string, fill?: boolean): void;
    zoom(dy: number): void;
}
