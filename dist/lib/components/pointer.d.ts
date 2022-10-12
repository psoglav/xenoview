import { Chart, Component } from '../core';
export default class Pointer extends Component {
    isVisible: Boolean;
    focusedPointIndex: number;
    focusedPoint: History.Point;
    private position;
    constructor(chart: Chart);
    move(): void;
    update(): void;
    drawVerticalLine(): void;
    drawHorizontalLine(): void;
}
