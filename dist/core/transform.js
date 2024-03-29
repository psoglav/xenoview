export class Transform {
    constructor(chart) {
        this.isPanning = false;
        this.ZOOM_RATE = 1;
        this.chart = chart;
        this.reset();
    }
    move(mx, my) {
        if (this.chart.mouse.isBlockedByUI)
            return;
        this.boundingRect.top += my;
        this.boundingRect.bottom += my;
        this.boundingRect.left += mx;
        this.boundingRect.right += mx;
        this.clamp();
        this.chart.chartLayer.needsUpdate = true;
    }
    // TODO: Make the calculations simpler
    zoom(dx, dy, xOrigin) {
        if (this.chart.mouse.isBlockedByUI)
            return;
        if (dx < 0 && this.chart.pointsGap < 1)
            return;
        if (dx > 0 && this.chart.pointsGap > 350)
            return;
        dx = dx < 0 ? Math.max(dx, -1) : Math.min(dx, 1);
        dy = dy < 0 ? Math.max(dy, -150) : Math.min(dy, 150);
        if (dx) {
            let zoomPoint = xOrigin || this.chart.chartLayer.width;
            let d = 11 / this.ZOOM_RATE;
            this.boundingRect.right += ((this.boundingRect.right - zoomPoint) / d) * dx;
            this.boundingRect.left += ((this.boundingRect.left - zoomPoint) / d) * dx;
            this.clamp();
        }
        if (dy) {
            let origin = this.chart.chartLayer.height / 2;
            let d = 6 / this.ZOOM_RATE;
            this.boundingRect.top -= (((this.boundingRect.top - origin) / d) * dy) / 100;
            this.boundingRect.bottom -= (((this.boundingRect.bottom - origin) / d) * dy) / 100;
        }
        this.chart.chartLayer.needsUpdate = true;
    }
    reset(full) {
        this.boundingRect = {
            top: 35,
            bottom: this.chart.chartLayer.height - 35,
            left: 0,
            right: this.chart.chartLayer.width,
            offsetX: 0,
            offsetY: 0
        };
        if (full) {
            this.boundingRect.left = 0;
        }
    }
    clamp() {
        let w = this.chart.chartLayer.width;
        let gap = this.chart.pointsGap;
        if (this.boundingRect.right < gap * 3) {
            this.boundingRect.right = gap * 3;
        }
        else if (this.boundingRect.left > w - gap * 3) {
            this.boundingRect.left = w - gap * 3;
        }
    }
}
