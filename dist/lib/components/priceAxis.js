"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("../core");
class PriceAxis extends core_1.Component {
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
        window.addEventListener('mousemove', e => this.zoom(e === null || e === void 0 ? void 0 : e.movementY));
        window.addEventListener('mouseup', () => (this.isZooming = false));
        window.addEventListener('resize', () => {
            let rect = this.chart.container.getBoundingClientRect();
            this.chart.setSize(70, rect.height - 28, this.canvas);
            this.update();
        });
    }
    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.style.gridArea = '1 / 2 / 2 / 3';
        this.canvas.style.width = '70px';
        this.canvas.style.height = '100%';
        this.canvas.style.cursor = 'n-resize';
        this.chart.container.appendChild(this.canvas);
        this.chart.rescale(this.ctx);
    }
    drawLabels() {
        let rows = this.chart.getGridRows();
        for (let i of rows) {
            let y = this.chart.normalizeToY(i);
            this.chart.moveTo(0, y, this.ctx);
            this.chart.lineTo(this.chart.getWidth(this.ctx), y, this.ctx);
            this.drawLabel(i.toFixed(2), y, this.chart.options.textColor);
        }
    }
    drawPriceLabel() {
        let y = this.chart.mousePosition.y - this.chart.canvasRect.top;
        let price = this.chart.normalizeToPrice(y).toFixed(2);
        this.drawLabel(price, y, 'white', this.chart.options.pointer.bgColor, true);
    }
    drawCurrentMarketPriceLabel() {
        let data = this.chart.history;
        if (!data || !data.length)
            return;
        let point = data[data.length - 1];
        let { close, open } = this.chart.normalizePoint(point);
        let y = close;
        let color = this.chart.options.line.color;
        if (this.chart.style.bars) {
            let type = close < open ? 'higher' : 'lower';
            color = this.chart.options.candles.colors[type];
        }
        this.chart.ctx.strokeStyle = color;
        this.chart.ctx.setLineDash([1, 2]);
        this.chart.ctx.beginPath();
        this.chart.moveTo(0, y);
        this.chart.lineTo(this.chart.mainCanvasWidth, y);
        this.chart.ctx.closePath();
        this.chart.ctx.stroke();
        this.chart.ctx.setLineDash([]);
        this.drawLabel(point.close.toFixed(2), y, 'white', color, true);
    }
    drawLabel(text, y, fgColor, bgColor, fill) {
        if (bgColor) {
            this.ctx.beginPath();
            this.ctx.strokeStyle = bgColor;
            this.ctx.lineJoin = 'round';
            if (fill) {
                this.ctx.lineWidth = 8;
                this.ctx.fillStyle = bgColor;
                this.ctx.rect(4, y - 5, this.chart.getWidth(this.ctx), 12);
            }
            else {
                this.ctx.lineWidth = 1;
                this.ctx.fillStyle = this.chart.options.bgColor;
                this.ctx.rect(4 + 0.5, Math.round(y) - 8.5, this.chart.getWidth(this.ctx), 20);
            }
            this.ctx.fill();
            this.ctx.stroke();
            this.ctx.closePath();
        }
        this.ctx.fillStyle = fgColor;
        this.ctx.font = '11px Verdana';
        this.ctx.fillText(text, 10, y + 5);
    }
    zoom(dy) {
        if (this.isZooming) {
            this.chart.transform.zoom(0, dy);
            this.chart.draw();
        }
    }
    update() {
        this.chart.clear(this.ctx);
        this.drawLabels();
        this.drawCurrentMarketPriceLabel();
        if (this.chart.pointer.isVisible) {
            this.drawPriceLabel();
        }
    }
}
exports.default = PriceAxis;
//# sourceMappingURL=priceAxis.js.map