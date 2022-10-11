"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("../core");
const utils_1 = require("../../utils");
class TimeAxis extends core_1.Component {
    constructor(chart) {
        super(chart);
        this.isZooming = false;
        this.createCanvas();
        this.bindEventListeners();
    }
    get ctx() {
        return this.canvas.getContext('2d');
    }
    bindEventListeners() {
        this.canvas.addEventListener('mousedown', () => (this.isZooming = true));
        this.canvas.addEventListener('mouseup', () => (this.isZooming = false));
        window.addEventListener('mousemove', (e) => this.zoom(e.movementX));
        window.addEventListener('mouseup', () => (this.isZooming = false));
        window.addEventListener('resize', () => {
            let rect = this.chart.container.getBoundingClientRect();
            this.chart.setSize(rect.width - 70, 28, this.canvas);
        });
    }
    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.style.gridArea = '2 / 1 / 3 / 3';
        this.canvas.style.width = 'calc(100% - 70px)';
        this.canvas.style.height = '28px';
        this.canvas.style.cursor = 'e-resize';
        this.chart.container.appendChild(this.canvas);
        this.chart.rescale(this.ctx);
    }
    drawLabels() {
        var _a, _b;
        let cols = this.chart.getGridColumns();
        this.chart.clear(this.ctx);
        this.ctx.beginPath();
        let size = ((_b = (_a = this.chart.options.timeAxis) === null || _a === void 0 ? void 0 : _a.labels) === null || _b === void 0 ? void 0 : _b.fontSize) || 11;
        this.ctx.fillStyle = this.chart.options.textColor;
        this.ctx.font = size + 'px Verdana';
        for (let i of cols) {
            let point = this.chart.history[i];
            let x = this.chart.getPointX(i);
            let time = (0, utils_1.getTimeFromTimestamp)(point.time * 1000);
            this.ctx.fillText(time, x - 16, 16);
        }
        this.ctx.stroke();
        this.ctx.closePath();
    }
    drawTimeMarker() {
        let data = this.chart.history;
        if (!data)
            return;
        let h = this.chart.getHeight(this.ctx);
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
        this.ctx.beginPath();
        this.ctx.fillStyle = this.chart.options.pointer.bgColor;
        this.chart.rect(x - 60, 0, 118, h, this.ctx);
        this.ctx.fill();
        this.ctx.closePath();
        this.ctx.fillStyle = 'white';
        this.ctx.font = '11px Verdana';
        this.ctx.fillText(time, x - 50, 20);
    }
    zoom(dx) {
        if (this.isZooming) {
            this.chart.transform.zoom(dx / -100, 0);
            this.chart.draw();
        }
    }
    update() {
        this.drawLabels();
        if (this.chart.pointer.isVisible) {
            this.drawTimeMarker();
        }
    }
}
exports.default = TimeAxis;
//# sourceMappingURL=timeAxis.js.map