import { Chart } from '.';
export declare abstract class ChartStyle {
    style: Chart.StyleName;
    chart: Chart;
    constructor(chart: Chart);
    abstract draw(): void;
}
