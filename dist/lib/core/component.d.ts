import { Chart } from './chart';
export declare abstract class Component {
    chart: Chart;
    constructor(chart: Chart);
    abstract update(): void;
}
