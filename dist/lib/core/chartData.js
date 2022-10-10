"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChartData = void 0;
const utils_1 = require("../../utils");
class ChartData {
    constructor() {
        this.topHistoryPrice = [0, 0];
        this.bottomHistoryPrice = [0, 0];
    }
    get chartFullWidth() {
        return this.chart.boundingRect.right - this.chart.boundingRect.left;
    }
    get pointsGap() {
        return this.chartFullWidth / this.history.length;
    }
    initData(chart) {
        this.chart = chart;
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
        if (!(value === null || value === void 0 ? void 0 : value.PRICE) ||
            !(value === null || value === void 0 ? void 0 : value.LASTUPDATE) ||
            currentPoint.close === value.PRICE)
            return;
        let pointMinutesTs = (0, utils_1.toMinutes)(value.LASTUPDATE);
        let currentPointMinutesTs = (0, utils_1.toMinutes)(currentPoint.time);
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
                low: value.PRICE,
            });
        }
        this.draw();
    }
    /**
     * Get point X position.
     * @param {number | History.Point} value a point or an index of it
     * @returns {number} X position
     */
    getPointX(value) {
        let i = value;
        let data = this.history;
        if (typeof value == 'object')
            i = data.indexOf(value);
        return (this.chart.boundingRect.left + (this.chartFullWidth / data.length) * i);
    }
    filterVisiblePoints(data) {
        return data.filter((_, i) => {
            let x = this.getPointX(i);
            return x > 0 && x < this.chart.mainCanvasWidth;
        });
    }
    filterVisiblePointsAndCache() {
        if (!this.history)
            return [];
        this.visiblePoints = this.filterVisiblePoints(this.history);
        return this.visiblePoints;
    }
    normalizeToPrice(y) {
        let minY = this.chart.boundingRect.bottom;
        let maxY = this.chart.boundingRect.top;
        let minPrice = this.bottomHistoryPrice[1];
        let maxPrice = this.topHistoryPrice[1];
        return minPrice + (0, utils_1.normalizeTo)(y, minY, maxY, minPrice, maxPrice);
    }
    normalizeToY(price) {
        let minY = this.chart.boundingRect.bottom;
        let maxY = this.chart.boundingRect.top;
        let minPrice = this.bottomHistoryPrice[1];
        let maxPrice = this.topHistoryPrice[1];
        return minY + (0, utils_1.normalizeTo)(price, minPrice, maxPrice, minY, maxY);
    }
    normalizePoint(point) {
        return Object.assign(Object.assign({}, point), { close: this.normalizeToY(point.close), open: this.normalizeToY(point.open), high: this.normalizeToY(point.high), low: this.normalizeToY(point.low) });
    }
    normalizeData() {
        let hist = this.history;
        if (!(hist === null || hist === void 0 ? void 0 : hist.length))
            return [];
        return hist.map((point) => this.normalizePoint(point));
    }
    getTopHistoryPrice() {
        let history = this.visiblePoints || this.filterVisiblePointsAndCache();
        history = history.map(({ high }) => high);
        let max = history[0];
        let i = 0;
        history.forEach((p, ii) => {
            if (p > max) {
                max = p;
                i = ii;
            }
        });
        this.topHistoryPrice = [i, max];
        return this.topHistoryPrice;
    }
    getBottomHistoryPrice() {
        let history = this.visiblePoints || this.filterVisiblePointsAndCache();
        history = history.map(({ low }) => low);
        let min = history[0];
        let i = 0;
        history.forEach((p, ii) => {
            if (p < min) {
                min = p;
                i = ii;
            }
        });
        this.bottomHistoryPrice = [i, min];
        return this.bottomHistoryPrice;
    }
    getGridRows() {
        let t = this.topHistoryPrice[1];
        let b = this.bottomHistoryPrice[1];
        if (t == 0 && b == 0)
            return [];
        t = Math.floor(t / 10) * 10;
        b = Math.floor(b / 10) * 10;
        let delta = t - b;
        let result = [];
        let length = delta / 10;
        let start = 0;
        let end = length;
        let step = 1;
        while (this.normalizeToY((start / length) * delta + b) <
            this.chart.getWidth(this.chart.ctx)) {
            start -= step;
            step += 5;
            if (start < -5000)
                break;
        }
        step = 0;
        while (this.normalizeToY((end / length) * delta + b) > 0) {
            end += step;
            step += 5;
            if (end > 5000)
                break;
        }
        for (let i = start; i <= end; i++) {
            result.push((i / length) * delta + b);
        }
        let prev = 0;
        return result.filter((i) => {
            let y = this.normalizeToY(i);
            let py = this.normalizeToY(prev);
            if (py - y < 30 && y != py) {
                return 0;
            }
            prev = i;
            return 1;
        });
    }
    getGridColumns() {
        let prev = 0;
        return this.history
            .map((_, i) => i)
            .filter((i) => {
            let x = this.getPointX(i);
            let px = this.getPointX(prev);
            if (x - px < 100 && x != px) {
                return 0;
            }
            prev = i;
            return 1;
        });
    }
}
exports.ChartData = ChartData;
//# sourceMappingURL=chartData.js.map