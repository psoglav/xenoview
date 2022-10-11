import { Chart, ChartStyle } from '../core'

export class Line extends ChartStyle {
  constructor(chart: Chart) {
    super(chart)
  }

  draw() {
    this.chart.getTopHistoryPrice()
    this.chart.getBottomHistoryPrice()

    let data = this.chart.history

    this.chart.ctx.strokeStyle = this.chart.options.line.color
    this.chart.ctx.lineWidth = this.chart.options.line.width

    this.chart.moveTo(
      this.chart.boundingRect.left - 10,
      this.chart.mainCanvasHeight
    )

    for (let i = 0; i < data.length - 1; i++) {
      let x1 = this.chart.boundingRect.left + i * this.chart.pointsGap
      let x2 = this.chart.boundingRect.left + (i + 1) * this.chart.pointsGap

      if (x1 > this.chart.mainCanvasWidth) break
      else if (x2 < 0) continue

      let { close: c1 } = data[i]
      let { close: c2 } = data[i + 1]

      c1 = this.chart.normalizeToY(c1)
      c2 = this.chart.normalizeToY(c2)

      this.chart.ctx.beginPath()

      this.chart.lineTo(x1, c1)
      this.chart.lineTo(x2, c2)

      this.chart.ctx.stroke()

      this.chart.ctx.closePath()

      this.chart.ctx.fillStyle = this.chart.options.candles.colors.higher

      if (i == data.length - 2) this.chart.circle(x2, c2, 3)
    }

    this.chart.ctx.lineWidth = 1
  }
}
