import { Component, Canvas } from '../core';
export default class Pointer extends Component {
    isVisible: boolean;
    focusedPointIndex: number;
    focusedPoint: History.Point;
    private position;
    constructor();
    move(): void;
    update(canvas: Canvas): void;
    draw(ctx: CanvasRenderingContext2D): void;
}
