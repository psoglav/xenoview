import { Chart } from './chart';
export declare abstract class ChartData {
    history: History.Data;
    chartData: History.Data;
    visiblePoints: History.Data;
    topHistoryPrice: [number, number];
    bottomHistoryPrice: [number, number];
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
    /**
     * Get point X position.
     * @param {number | History.Point} value a point or an index of it
     * @returns {number} X position
     */
    getPointX(value: any): number;
    filterVisiblePoints(data: any[]): any[];
    filterVisiblePointsAndCache(): History.Data;
    normalizeToPrice(y: number): number;
    normalizeToY(price: number): number;
    normalizePoint(point: History.Point): History.Point;
    normalizeData(): History.Data;
    getTopHistoryPrice(): [number, number];
    getBottomHistoryPrice(): [number, number];
    abstract draw(): void;
}
