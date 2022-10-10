import { Chart } from '../core/chart';
import { Component } from '../core/component';
export default class Pointer extends Component {
    isVisible: Boolean;
    focusedPointIndex: number;
    focusedPoint: History.Point;
    private position;
    constructor(chart: Chart);
    move(): void;
    update(): void;
}
