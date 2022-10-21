import { Canvas, Chart, Component } from '../core';
export default class Grid extends Component {
    constructor(chart: Chart);
    update(canvas: Canvas): void;
    drawRows(ctx: CanvasRenderingContext2D): void;
    drawColumns(ctx: CanvasRenderingContext2D): void;
}
