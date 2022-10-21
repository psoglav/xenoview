import { Canvas, Chart, Component } from '../core';
export default class TimeAxis extends Component {
    isZooming: boolean;
    constructor(chart: Chart);
    drawLabels(ctx: CanvasRenderingContext2D): void;
    drawTimeMarker(ctx: CanvasRenderingContext2D): void;
    zoom(dx: number): void;
    update(canvas: Canvas): void;
}
