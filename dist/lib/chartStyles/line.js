"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Line = void 0;
const core_1 = require("../core");
class Line extends core_1.ChartStyle {
    constructor(chart) {
        super(chart);
    }
    draw() {
        this.chart.getTopHistoryPrice();
        this.chart.getBottomHistoryPrice();
        let data = this.chart.history;
        this.chart.ctx.strokeStyle = this.chart.options.candles.colors.higher;
        this.chart.moveTo(this.chart.boundingRect.left - 10, this.chart.mainCanvasHeight);
        for (let i = 0; i < data.length - 1; i++) {
            let x1 = this.chart.boundingRect.left + i * this.chart.pointsGap;
            let x2 = this.chart.boundingRect.left + (i + 1) * this.chart.pointsGap;
            if (x1 > this.chart.mainCanvasWidth)
                break;
            else if (x2 < 0)
                continue;
            let { close: c1 } = data[i];
            let { close: c2 } = data[i + 1];
            c1 = this.chart.normalizeToY(c1);
            c2 = this.chart.normalizeToY(c2);
            this.chart.ctx.beginPath();
            this.chart.lineTo(x1, c1);
            this.chart.lineTo(x2, c2);
            this.chart.ctx.stroke();
            this.chart.ctx.closePath();
        }
    }
}
exports.Line = Line;
//# sourceMappingURL=line.js.map