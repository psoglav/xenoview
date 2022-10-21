import { Chart, Component, Canvas } from '../core';
export default class Pointer extends Component {
    isVisible: Boolean;
    focusedPointIndex: number;
    focusedPoint: History.Point;
    private position;
    constructor(chart: Chart);
    move(): void;
    update(canvas: Canvas): void;
    draw(ctx: CanvasRenderingContext2D): void;
}
