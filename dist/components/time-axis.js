import { Component } from '../core';
import { currentTimeTickMark, timeTickMark } from '../utils';
export default class TimeAxis extends Component {
    constructor() {
        super();
        this.isZooming = false;
    }
    drawLabels(canvas) {
        var _a, _b;
        let cols = this.chart.getTimeTicks();
        canvas.ctx.beginPath();
        let size = ((_b = (_a = this.chart.options.timeAxis) === null || _a === void 0 ? void 0 : _a.labels) === null || _b === void 0 ? void 0 : _b.fontSize) || 11;
        canvas.ctx.fillStyle = this.chart.options.textColor;
        canvas.ctx.font = size + 'px Verdana';
        for (let i of cols) {
            let point = this.chart.history[i];
            if (!point)
                continue;
            let x = this.chart.getPointX(i);
            let time = timeTickMark(point.time);
            canvas.ctx.textAlign = 'center';
            canvas.ctx.fillText(time, x, 16);
        }
        canvas.ctx.stroke();
        canvas.ctx.closePath();
    }
    drawTimeMarker(canvas) {
        let data = this.chart.history;
        if (!data)
            return;
        let x = this.chart.mouse.x - this.chart.canvasRect.x;
        let i = Math.round(((x - this.chart.boundingRect.left) / this.chart.chartFullWidth) * data.length);
        let point = data[i];
        if (!point)
            return;
        let time = currentTimeTickMark(point.time);
        x = this.chart.getPointX(i);
        canvas.ctx.beginPath();
        canvas.ctx.fillStyle = this.chart.options.pointer.bgColor;
        canvas.rect(x - 66, 0, 128, canvas.height);
        canvas.ctx.fill();
        canvas.ctx.closePath();
        canvas.ctx.fillStyle = 'white';
        canvas.ctx.font = '11px Verdana';
        canvas.ctx.fillText(time, x, 20);
    }
    zoom(dx) {
        if (this.isZooming) {
            this.chart.transform.zoom(dx / -100, 0);
        }
    }
    update(canvas) {
        this.drawLabels(canvas);
        if (this.chart.pointer.isVisible) {
            this.drawTimeMarker(canvas);
        }
    }
}
