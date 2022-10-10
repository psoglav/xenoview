import { Chart } from '@/lib/core'

export class Transform {
  public boundingRect: Chart.BoundingRect

  chart: Chart

  ZOOM_RATE: number = 1

  constructor(chart: Chart) {
    this.chart = chart
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
    if (this.chart.options?.autoScale) this.chart.filterVisiblePointsAndCache()
  }

  zoom(dx: number, dy: number) {
    if (dx) {
      let zoomPoint = this.chart.mainCanvasWidth
      let d = 11 / this.ZOOM_RATE

      this.boundingRect.right +=
        ((this.boundingRect.right - zoomPoint) / d) * dx
      this.boundingRect.left += ((this.boundingRect.left - zoomPoint) / d) * dx

      this.clamp()
    } else if (dy) {
      let origin = this.chart.mainCanvasHeight / 2
      let d = 6 / this.ZOOM_RATE

      this.boundingRect.top -=
        (((this.boundingRect.top - origin) / d) * dy) / 100
      this.boundingRect.bottom -=
        (((this.boundingRect.bottom - origin) / d) * dy) / 100
    }

    if (this.chart.options?.autoScale) this.chart.filterVisiblePointsAndCache()
  }

  reset(full?: boolean) {
    this.boundingRect = {
      top: 35,
      bottom: this.chart.mainCanvasHeight - 35,
      left: this.chart.mainCanvasWidth * -10,
      right: this.chart.mainCanvasWidth,
    }

    if (full) {
      this.boundingRect.left = 0
      this.chart.filterVisiblePointsAndCache()
    }
  }

  clamp() {
    this.boundingRect.left > 0 && (this.boundingRect.left = 0)

    if (this.boundingRect.right < this.chart.mainCanvasWidth - 200) {
      this.boundingRect.right = this.chart.mainCanvasWidth - 200
    }
  }
}
