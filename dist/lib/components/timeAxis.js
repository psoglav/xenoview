"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("../core");
const utils_1 = require("../../utils");
class TimeAxis extends core_1.Component {
    constructor(chart) {
        super(chart);
        this.isZooming = false;
    }
    drawLabels(ctx) {
        var _a, _b;
        let cols = this.chart.getGridColumns();
        this.chart.clear(ctx);
        ctx.beginPath();
        let size = ((_b = (_a = this.chart.options.timeAxis) === null || _a === void 0 ? void 0 : _a.labels) === null || _b === void 0 ? void 0 : _b.fontSize) || 11;
        ctx.fillStyle = this.chart.options.textColor;
        ctx.font = size + 'px Verdana';
        for (let i of cols) {
            let point = this.chart.history[i];
            let x = this.chart.getPointX(i);
            let time = (0, utils_1.getTimeFromTimestamp)(point.time * 1000);
            ctx.fillText(time, x - 16, 16);
        }
        ctx.stroke();
        ctx.closePath();
    }
    drawTimeMarker(ctx) {
        let data = this.chart.history;
        if (!data)
            return;
        let h = this.chart.getHeight(ctx);
        let x = this.chart.mousePosition.x - this.chart.canvasRect.x;
        let i = Math.round(((x - this.chart.boundingRect.left) / this.chart.chartFullWidth) *
            data.length);
        let point = data[i];
        if (!point)
            return;
        if (point.time.toString().length != 13)
            point.time *= 1000;
        let time = (0, utils_1.getFullTimeFromTimestamp)(point.time);
        x = this.chart.getPointX(i);
        ctx.beginPath();
        ctx.fillStyle = this.chart.options.pointer.bgColor;
        this.chart.rect(x - 60, 0, 118, h, ctx);
        ctx.fill();
        ctx.closePath();
        ctx.fillStyle = 'white';
        ctx.font = '11px Verdana';
        ctx.fillText(time, x - 50, 20);
    }
    zoom(dx) {
        if (this.isZooming) {
            this.chart.transform.zoom(dx / -100, 0);
        }
    }
    update(canvas) {
        this.chart.clear(canvas.ctx);
        this.drawLabels(canvas.ctx);
        if (this.chart.pointer.isVisible) {
            this.drawTimeMarker(canvas.ctx);
        }
    }
}
exports.default = TimeAxis;
//# sourceMappingURL=timeAxis.js.map