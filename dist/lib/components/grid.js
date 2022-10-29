"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("../core");
class Grid extends core_1.Component {
    constructor(chart) {
        super(chart);
    }
    update(canvas) {
        this.drawRows(canvas.ctx);
        this.drawColumns(canvas.ctx);
    }
    drawRows(ctx) {
        let rows = this.chart.getPriceTicks();
        ctx.beginPath();
        ctx.strokeStyle = '#7777aa33';
        for (let i of rows) {
            let y = this.chart.normalizeToY(i);
            this.chart.moveTo(0, y, ctx);
            this.chart.lineTo(this.chart.getWidth(ctx), y, ctx);
        }
        ctx.stroke();
        ctx.closePath();
    }
    drawColumns(ctx) {
        let cols = this.chart.getGridColumns();
        ctx.beginPath();
        ctx.strokeStyle = '#7777aa33';
        for (let i of cols) {
            let x = this.chart.getPointX(i);
            this.chart.moveTo(x, 0, ctx);
            this.chart.lineTo(x, this.chart.mainCanvasHeight, ctx);
        }
        ctx.stroke();
        ctx.closePath();
    }
}
exports.default = Grid;
//# sourceMappingURL=grid.js.map