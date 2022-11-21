import { Canvas, Chart, Component } from '../core';
export default class PriceAxis extends Component {
    isZooming: boolean;
    constructor(chart: Chart);
    drawGridLabels(canvas: Canvas): void;
    drawPointerPrice(canvas: Canvas): void;
    drawLastVisiblePrice(canvas: Canvas): void;
    drawLastPrice(canvas: Canvas): void;
    drawLabel(text: any, y: number, canvas: Canvas, fgColor: string, bgColor?: string, fill?: boolean): void;
    zoom(dy: number): void;
    update(canvas: Canvas): void;
}
