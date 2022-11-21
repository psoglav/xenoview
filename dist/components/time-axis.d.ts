import { Canvas, Chart, Component } from '../core';
export default class TimeAxis extends Component {
    isZooming: boolean;
    constructor(chart: Chart);
    drawLabels(canvas: Canvas): void;
    drawTimeMarker(canvas: Canvas): void;
    zoom(dx: number): void;
    update(canvas: Canvas): void;
}
