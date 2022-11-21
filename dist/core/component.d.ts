import { Chart, Canvas } from '.';
export declare abstract class Component {
    chart: Chart;
    constructor(chart: Chart);
    abstract update(canvas: Canvas): void;
}
