"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Area = void 0;
const line_1 = require("./line");
class Area extends line_1.Line {
    constructor(chart) {
        super(chart);
        this.bars = false;
    }
    draw() {
        this.chart.getTopHistoryPrice();
        this.chart.getBottomHistoryPrice();
        this.drawArea();
        this.drawLine();
        this.drawLivePoint();
    }
    drawArea() {
        let data = this.chart.history;
        let ctx = this.chart.ctx;
        ctx.strokeStyle = this.chart.options.line.color;
        ctx.lineWidth = this.chart.options.line.width;
        let grd = ctx.createLinearGradient(0, 0, 0, this.chart.mainCanvasHeight);
        grd.addColorStop(0, this.chart.options.line.color + '55');
        grd.addColorStop(1, this.chart.options.line.color + '07');
        ctx.beginPath();
        this.chart.moveTo(0, this.chart.mainCanvasHeight);
        this.chart.lineTo(0, this.chart.normalizeToY(data[0].close));
        for (let i = 0; i < data.length - 1; i++) {
            var x1 = this.chart.boundingRect.left + i * this.chart.pointsGap;
            var x2 = this.chart.boundingRect.left + (i + 1) * this.chart.pointsGap;
            if (x1 > this.chart.mainCanvasWidth)
                break;
            else if (x2 < 0)
                continue;
            let { close: c1 } = data[i];
            let { close: c2 } = data[i + 1];
            c1 = this.chart.normalizeToY(c1);
            c2 = this.chart.normalizeToY(c2);
            this.chart.lineTo(x1, c1);
            this.chart.lineTo(x2, c2);
        }
        this.chart.lineTo(x2, this.chart.mainCanvasHeight);
        ctx.fillStyle = grd;
        ctx.fill();
        ctx.closePath();
    }
}
exports.Area = Area;
//# sourceMappingURL=area.js.map