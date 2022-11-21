import { DateRange, Interval } from '../types/time';
import { Chart } from './chart';
import { DataProvider } from './data-provider';
export declare abstract class ChartData {
    dataProvider: DataProvider;
    history: History.Data;
    chartData: History.Data;
    highestPrice: [number, number];
    lowestPrice: [number, number];
    renderedChartLength: number;
    private chart;
    get chartFullWidth(): number;
    get pointsGap(): number;
    constructor();
    initData(chart: Chart): Promise<void>;
    fetchHistory(): Promise<void>;
    setInterval(value: Interval): Promise<void>;
    setRange(value: DateRange): Promise<void>;
    updatePoint(point: History.Point, value: {
        PRICE: number;
        LASTUPDATE: number;
    }): void;
    updateCurrentPoint(value: any): void;
    getPointX(value: any): number;
    visibleRange(boundless?: boolean): number[];
    get visiblePoints(): History.Point[];
    get lastPoint(): History.Point;
    get lastVisiblePoint(): History.Point;
    normalizeToPrice(y: number): number;
    normalizeToY(price: number): number;
    getPointIndexByX(x: number): number;
    normalizePoint(point: History.Point): History.Point;
    normalizeData(): History.Data;
    getHighestAndLowestPrice(): void;
    getUpperPriceBound(): number;
    getLowerPriceBound(): number;
    getPriceTicks(): number[];
    getTimeTicks(): number[];
}