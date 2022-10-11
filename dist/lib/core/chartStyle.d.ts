import { Chart } from '.';
export declare abstract class ChartStyle {
    type: Chart.Type;
    chart: Chart;
    constructor(chart: Chart);
    abstract draw(): void;
}
