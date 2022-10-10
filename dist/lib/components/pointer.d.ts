import { Chart } from '../core/chart';
import { Component } from '../core/component';
export default class Pointer extends Component {
    isVisible: Boolean;
    constructor(chart: Chart);
    update(): void;
}
