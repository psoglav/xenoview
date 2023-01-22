import { Component } from '../core';
export default class Pointer extends Component {
    constructor() {
        super();
        this.isVisible = false;
        this.position = {
            x: 0,
            y: 0
        };
    }
    move() {
        let data = this.chart.chartData;
        if (!(data === null || data === void 0 ? void 0 : data.length))
            return;
        let x = ((this.chart.mouse.x - this.chart.canvasRect.x - this.chart.boundingRect.left) / this.chart.chartFullWidth) *
            data.length;
        let i = Math.round(x);
        i = i > data.length - 1 ? data.length - 1 : i < 0 ? 0 : i;
        this.focusedPointIndex = i;
        this.focusedPoint = this.chart.history[i];
        this.position.y = this.chart.mouse.y;
    }
    update(canvas) {
        var _a;
        if (!((_a = this.chart.chartData) === null || _a === void 0 ? void 0 : _a.length) || !this.isVisible || this.chart.mouse.isBlockedByUI)
            return;
        canvas.ctx.strokeStyle = this.chart.options.pointer.fgColor;
        this.draw(canvas.ctx);
        this.chart.layout.legend.update();
    }
    draw(ctx) {
        let w = ctx.canvas.clientWidth;
        let h = ctx.canvas.clientHeight;
        let x = Math.round(this.chart.boundingRect.left +
            this.chart.pointsGap *
                Math.round(this.chart.getPointIndexByX(this.chart.mouse.x - this.chart.canvasRect.left))) + 0.5;
        let y = Math.round(this.position.y + (this.chart.chartLayer.height % 2) / 2 - this.chart.canvasRect.top) + 0.5;
        ctx.setLineDash([5, 5]);
        let b = Math.floor(Math.max(w, h) / 10) * 10 + 2;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, b);
        ctx.closePath();
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(b, y);
        ctx.closePath();
        ctx.stroke();
        ctx.lineDashOffset = 0;
        ctx.setLineDash([]);
    }
}
