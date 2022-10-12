import { Chart } from '.';
export declare abstract class ChartStyle {
    style: Chart.StyleName;
    chart: Chart;
    abstract bars: boolean;
    constructor(chart: Chart);
    abstract draw(): void;
}
