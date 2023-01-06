import Moment from 'moment';
import { extendMoment } from 'moment-range';
import { getNiceScale, getRangeByStep, normalizeTo, toMinutes } from '../utils';
import { DataProvider } from './data-provider';
const moment = extendMoment(Moment);
export class ChartData {
    get chartFullWidth() {
        return this.chart.boundingRect.right - this.chart.boundingRect.left;
    }
    get pointsGap() {
        var _a;
        return this.chartFullWidth / ((_a = this.history) === null || _a === void 0 ? void 0 : _a.length);
    }
    constructor() {
        this.highestPrice = [0, 0];
        this.lowestPrice = [0, 0];
        this.renderedChartLength = 0;
    }
    async initData(chart) {
        this.chart = chart;
        if (this.chart.options.dataProvider) {
            this.dataProvider = new DataProvider(this.chart.options.dataProvider);
            await this.fetchHistory();
            setInterval(() => {
                this.updateCurrentPoint(this.dataProvider.state);
            }, 500);
        }
    }
    async fetchHistory() {
        this.chart.loadHistory(await this.dataProvider.requestHistory());
    }
    async setInterval(value) {
        this.dataProvider.setInterval(value);
        await this.fetchHistory();
    }
    async setRange(value) {
        this.dataProvider.setRange(value);
        await this.fetchHistory();
    }
    async setFromSymbol(value) {
        this.dataProvider.setFromSymbol(value);
        await this.fetchHistory();
    }
    async setToSymbol(value) {
        this.dataProvider.setToSymbol(value);
        await this.fetchHistory();
    }
    updatePoint(point, value) {
        point.close = value.PRICE;
        point.time = value.LASTUPDATE;
        if (point.close < point.low)
            point.low = point.close;
        if (point.close > point.high)
            point.high = point.close;
    }
    updateCurrentPoint(value) {
        let hist = this.history;
        if (!(hist === null || hist === void 0 ? void 0 : hist.length))
            return;
        let currentPoint = hist[hist.length - 1];
        if (!(value === null || value === void 0 ? void 0 : value.PRICE) || !(value === null || value === void 0 ? void 0 : value.LASTUPDATE) || currentPoint.close === value.PRICE)
            return;
        let pointMinutesTs = toMinutes(value.LASTUPDATE);
        let currentPointMinutesTs = toMinutes(currentPoint.time);
        if (currentPointMinutesTs == pointMinutesTs) {
            this.updatePoint(hist[hist.length - 1], value);
        }
        else if (pointMinutesTs > currentPointMinutesTs) {
            let pp = hist[hist.length - 1];
            if (value.PRICE < pp.low)
                pp.low = value.PRICE;
            if (value.PRICE > pp.high)
                pp.high = value.PRICE;
            pp.close = value.PRICE;
            hist.shift();
            hist.push({
                time: value.LASTUPDATE,
                high: value.PRICE,
                open: value.PRICE,
                close: value.PRICE,
                low: value.PRICE
            });
        }
        this.chart.chartLayer.needsUpdate = true;
    }
    getPointX(value) {
        let i = value;
        let data = this.history;
        if (typeof value == 'object')
            i = data.indexOf(value);
        return this.chart.boundingRect.left + this.pointsGap * i;
    }
    visibleRange(boundless) {
        let left = this.chart.boundingRect.left, width = this.chart.chartLayer.width, start = Math.round((left * -1) / this.pointsGap), end = Math.round((left * -1 + width) / this.pointsGap);
        if (!boundless) {
            start = Math.max(start - 1, 0);
            end = Math.min(end, this.history.length - 1);
        }
        return [start, end];
    }
    get visiblePoints() {
        var _a;
        return (_a = this.history) === null || _a === void 0 ? void 0 : _a.slice(...this.visibleRange());
    }
    get lastPoint() {
        return this.history[this.history.length - 1];
    }
    get lastVisiblePoint() {
        return this.history[this.visibleRange()[1]];
    }
    normalizeToPrice(y) {
        let minY = this.chart.boundingRect.bottom;
        let maxY = this.chart.boundingRect.top;
        let minPrice = this.lowestPrice[1];
        let maxPrice = this.highestPrice[1];
        return minPrice + normalizeTo(y, minY, maxY, minPrice, maxPrice);
    }
    normalizeToY(price) {
        let minY = this.chart.boundingRect.bottom;
        let maxY = this.chart.boundingRect.top;
        let minPrice = this.lowestPrice[1];
        let maxPrice = this.highestPrice[1];
        return minY + normalizeTo(price, minPrice, maxPrice, minY, maxY);
    }
    getPointIndexByX(x) {
        let left = this.chart.boundingRect.left;
        return Math.round((x + left * -1) / this.pointsGap);
    }
    normalizePoint(point) {
        return Object.assign(Object.assign({}, point), { close: this.normalizeToY(point.close), open: this.normalizeToY(point.open), high: this.normalizeToY(point.high), low: this.normalizeToY(point.low) });
    }
    normalizeData() {
        let hist = this.history;
        if (!(hist === null || hist === void 0 ? void 0 : hist.length))
            return [];
        return hist.map(point => this.normalizePoint(point));
    }
    getHighestAndLowestPrice() {
        let history = this.visiblePoints;
        if (!history)
            return;
        let { high, low } = history[0];
        this.highestPrice = [0, high];
        this.lowestPrice = [0, low];
        history.forEach((p, i) => {
            if (p.high > this.highestPrice[1]) {
                this.highestPrice = [i, p.high];
            }
            if (p.low < this.lowestPrice[1]) {
                this.lowestPrice = [i, p.low];
            }
        });
    }
    getUpperPriceBound() {
        return this.normalizeToPrice(0);
    }
    getLowerPriceBound() {
        return this.normalizeToPrice(this.chart.chartLayer.height);
    }
    getPriceTicks() {
        let start = this.getLowerPriceBound();
        let end = this.getUpperPriceBound();
        let ticks = Math.floor(this.chart.chartLayer.height / 30);
        let scale = getNiceScale(start, end, ticks);
        return getRangeByStep(...scale[0], scale[1]);
    }
    // TODO: gonna implement this in other way, and for now, it looks ugly.
    getTimeTicks() {
        let [start, end] = this.visibleRange(true);
        let scale = getNiceScale(start, end, 10);
        return getRangeByStep(...scale[0], scale[1]);
    }
}
