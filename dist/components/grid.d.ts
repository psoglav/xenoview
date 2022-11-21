import { Canvas, Chart, Component } from '../core';
export default class Grid extends Component {
    constructor(chart: Chart);
    update(canvas: Canvas): void;
    drawRows(canvas: Canvas): void;
    drawColumns(canvas: Canvas): void;
}
