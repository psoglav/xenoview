"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const component_1 = require("../core/component");
class Pointer extends component_1.Component {
    constructor(chart) {
        super(chart);
        this.isVisible = false;
    }
    update() {
        var _a;
        if (!((_a = this.chart.chartData) === null || _a === void 0 ? void 0 : _a.length) || !this.isVisible)
            return;
        let ctx = this.chart.chartContext;
        let x = this.chart.position.left +
            this.chart.pointsGap * this.chart.focusedPointIndex;
        let y = this.chart.mousePosition.y;
        ctx.strokeStyle = this.chart.options.pointer.fgColor;
        ctx.setLineDash([5, 4]);
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, this.chart.mainCanvasHeight);
        ctx.moveTo(1, y - this.chart.canvasRect.top);
        ctx.lineTo(this.chart.mainCanvasWidth, y - this.chart.canvasRect.top);
        ctx.closePath();
        ctx.stroke();
        ctx.setLineDash([]);
    }
}
exports.default = Pointer;
//# sourceMappingURL=pointer.js.map