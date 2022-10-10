"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("../core");
class Pointer extends core_1.Component {
    constructor(chart) {
        super(chart);
        this.isVisible = false;
        this.position = {
            x: 0,
            y: 0,
        };
    }
    move() {
        let data = this.chart.chartData;
        if (!(data === null || data === void 0 ? void 0 : data.length))
            return;
        let x = ((this.chart.mousePosition.x -
            this.chart.canvasRect.x -
            this.chart.boundingRect.left) /
            this.chart.chartFullWidth) *
            data.length;
        let i = Math.round(x);
        i = i > data.length - 1 ? data.length - 1 : i < 0 ? 0 : i;
        this.focusedPointIndex = i;
        this.focusedPoint = this.chart.history[i];
        this.position.y = this.chart.mousePosition.y;
    }
    update() {
        var _a;
        if (!((_a = this.chart.chartData) === null || _a === void 0 ? void 0 : _a.length) || !this.isVisible)
            return;
        let { x, y } = this.position;
        x = this.chart.boundingRect.left + this.chart.pointsGap * this.focusedPointIndex;
        this.chart.ctx.strokeStyle = this.chart.options.pointer.fgColor;
        this.chart.ctx.setLineDash([5, 4]);
        this.chart.ctx.beginPath();
        this.chart.ctx.moveTo(x, 0);
        this.chart.ctx.lineTo(x, this.chart.mainCanvasHeight);
        this.chart.ctx.moveTo(1, y - this.chart.canvasRect.top);
        this.chart.ctx.lineTo(this.chart.mainCanvasWidth, y - this.chart.canvasRect.top);
        this.chart.ctx.closePath();
        this.chart.ctx.stroke();
        this.chart.ctx.setLineDash([]);
    }
}
exports.default = Pointer;
//# sourceMappingURL=pointer.js.map