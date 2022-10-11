"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transform = void 0;
class Transform {
    constructor(chart) {
        this.isPanning = false;
        this.ZOOM_RATE = 1;
        this.chart = chart;
    }
    move(mx, my) {
        var _a;
        this.boundingRect.top += my;
        this.boundingRect.bottom += my;
        if (this.boundingRect.right == this.chart.mainCanvasWidth - 200 && mx < 0)
            return;
        if (this.boundingRect.left == 0 && mx > 0)
            return;
        this.boundingRect.left += mx;
        this.boundingRect.right += mx;
        this.clamp();
        if ((_a = this.chart.options) === null || _a === void 0 ? void 0 : _a.autoScale)
            this.chart.filterVisiblePointsAndCache();
    }
    // TODO: Make the calculations simpler
    zoom(dx, dy, xOrigin) {
        var _a;
        if (dx < 0 && this.chart.pointsGap < 1.7)
            return;
        if (dx > 0 && this.chart.pointsGap > 350)
            return;
        dx = dx < 0 ? Math.max(dx, -1) : Math.min(dx, 1);
        dy = dy < 0 ? Math.max(dy, -150) : Math.min(dy, 150);
        if (dx) {
            let zoomPoint = xOrigin || this.chart.mainCanvasWidth;
            let d = 11 / this.ZOOM_RATE;
            this.boundingRect.right +=
                ((this.boundingRect.right - zoomPoint) / d) * dx;
            this.boundingRect.left += ((this.boundingRect.left - zoomPoint) / d) * dx;
            this.clamp();
        }
        if (dy) {
            let origin = this.chart.mainCanvasHeight / 2;
            let d = 6 / this.ZOOM_RATE;
            this.boundingRect.top -=
                (((this.boundingRect.top - origin) / d) * dy) / 100;
            this.boundingRect.bottom -=
                (((this.boundingRect.bottom - origin) / d) * dy) / 100;
        }
        if ((_a = this.chart.options) === null || _a === void 0 ? void 0 : _a.autoScale)
            this.chart.filterVisiblePointsAndCache();
    }
    reset(full) {
        this.boundingRect = {
            top: 35,
            bottom: this.chart.mainCanvasHeight - 35,
            left: this.chart.mainCanvasWidth * -10,
            right: this.chart.mainCanvasWidth
        };
        if (full) {
            this.boundingRect.left = 0;
            this.chart.filterVisiblePointsAndCache();
        }
    }
    clamp() {
        this.boundingRect.left > 0 && (this.boundingRect.left = 0);
        if (this.boundingRect.right < this.chart.mainCanvasWidth - 200) {
            this.boundingRect.right = this.chart.mainCanvasWidth - 200;
        }
    }
}
exports.Transform = Transform;
//# sourceMappingURL=transform.js.map