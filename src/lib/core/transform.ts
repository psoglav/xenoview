import { Chart } from '@/lib/core'

export class Transform {
  public boundingRect: Chart.BoundingRect
  public isPanning: boolean = false

  chart: Chart

  ZOOM_RATE: number = 1

  constructor(chart: Chart) {
    this.chart = chart
    this.reset()
  }

  move(mx: number, my: number) {
    this.boundingRect.top += my
    this.boundingRect.bottom += my

    if (this.boundingRect.right == this.chart.mainCanvasWidth - 200 && mx < 0)
      return
    if (this.boundingRect.left == 0 && mx > 0) return

    this.boundingRect.left += mx
    this.boundingRect.right += mx

    this.clamp()

    this.chart.chartLayer.needsUpdate = true
  }

  // TODO: Make the calculations simpler
  zoom(dx: number, dy: number, xOrigin?: number) {
    if (dx < 0 && this.chart.pointsGap < 1) return
    if (dx > 0 && this.chart.pointsGap > 350) return

    dx = dx < 0 ? Math.max(dx, -1) : Math.min(dx, 1)
    dy = dy < 0 ? Math.max(dy, -150) : Math.min(dy, 150)

    if (dx) {
      let zoomPoint = xOrigin || this.chart.mainCanvasWidth
      let d = 11 / this.ZOOM_RATE

      this.boundingRect.right +=
        ((this.boundingRect.right - zoomPoint) / d) * dx
      this.boundingRect.left += ((this.boundingRect.left - zoomPoint) / d) * dx

      this.clamp()
    }

    if (dy) {
      let origin = this.chart.mainCanvasHeight / 2
      let d = 6 / this.ZOOM_RATE

      this.boundingRect.top -=
        (((this.boundingRect.top - origin) / d) * dy) / 100
      this.boundingRect.bottom -=
        (((this.boundingRect.bottom - origin) / d) * dy) / 100
    }

    this.chart.chartLayer.needsUpdate = true
  }

  reset(full?: boolean) {
    this.boundingRect = {
      top: 35,
      bottom: this.chart.mainCanvasHeight - 35,
      left: this.chart.mainCanvasWidth * -10,
      right: this.chart.mainCanvasWidth,
      offsetX: 0,
      offsetY: 0
    }

    if (full) {
      this.boundingRect.left = 0
    }
  }

  clamp() {
    let w = this.chart.mainCanvasWidth
    let gap = this.chart.pointsGap

    if (this.boundingRect.right < gap * 3) {
      this.boundingRect.right = gap * 3
    } else if (this.boundingRect.left > w - gap * 3) {
      this.boundingRect.left = w - gap * 3
    }
  }
}
