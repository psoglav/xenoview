"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Area = void 0;
const core_1 = require("../core");
class Area extends core_1.ChartStyle {
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
    drawLivePoint() {
        let data = this.chart.history;
        let x = this.chart.boundingRect.left + (data.length - 1) * this.chart.pointsGap;
        let y = this.chart.normalizeToY(data[data.length - 1].close);
        this.chart.ctx.fillStyle = this.chart.options.line.color;
        this.chart.circle(x, y, 3);
        this.chart.ctx.fill();
    }
    drawLine() {
        let data = this.chart.history;
        let ctx = this.chart.ctx;
        ctx.strokeStyle = this.chart.options.line.color;
        ctx.lineWidth = this.chart.options.line.width;
        ctx.lineJoin = 'round';
        ctx.beginPath();
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
        ctx.stroke();
        ctx.closePath();
        ctx.lineWidth = 1;
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