import { Chart } from './chart';
export declare abstract class ChartData {
    history: History.Data;
    chartData: History.Data;
    highestPrice: [number, number];
    lowestPrice: [number, number];
    renderedChartLength: number;
    private chart;
    get chartFullWidth(): number;
    get pointsGap(): number;
    constructor();
    initData(chart: Chart): void;
    updatePoint(point: History.Point, value: {
        PRICE: number;
        LASTUPDATE: number;
    }): void;
    updateCurrentPoint(value: any): void;
    getPointX(value: any): number;
    get visibleRange(): number[];
    get visiblePoints(): History.Point[];
    get lastPoint(): History.Point;
    get lastVisiblePoint(): History.Point;
    normalizeToPrice(y: number): number;
    normalizeToY(price: number): number;
    normalizePoint(point: History.Point): History.Point;
    normalizeData(): History.Data;
    getHighestAndLowestPrice(): void;
    getGridRows(): any[];
    getGridColumns(): number[];
}
