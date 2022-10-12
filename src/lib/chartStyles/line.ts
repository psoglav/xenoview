import { Chart, ChartStyle } from '../core'

export class Line extends ChartStyle {
  bars = false

  constructor(chart: Chart) {
    super(chart)
  }

  draw() {
    this.drawLine()
    this.drawLivePoint()
  }

  drawLivePoint() {
    let data = this.chart.history
    let x =
      this.chart.boundingRect.left + (data.length - 1) * this.chart.pointsGap
    let y = this.chart.normalizeToY(data[data.length - 1].close)
    this.chart.ctx.fillStyle = this.chart.options.line.color
    this.chart.circle(x, y, 3)
    this.chart.ctx.fill()
  }

  drawLine() {
    let data = this.chart.history
    let ctx = this.chart.ctx

    ctx.strokeStyle = this.chart.options.line.color
    ctx.lineWidth = this.chart.options.line.width
    ctx.lineJoin = 'round'

    ctx.beginPath()

    for (let i = 0; i < data.length - 1; i++) {
      var x1 = this.chart.boundingRect.left + i * this.chart.pointsGap
      var x2 = this.chart.boundingRect.left + (i + 1) * this.chart.pointsGap

      if (x1 > this.chart.mainCanvasWidth) break
      else if (x2 < 0) continue

      let { close: c1 } = data[i]
      let { close: c2 } = data[i + 1]

      c1 = this.chart.normalizeToY(c1)
      c2 = this.chart.normalizeToY(c2)

      this.chart.lineTo(x1, c1)
      this.chart.lineTo(x2, c2)
    }

    ctx.stroke()
    ctx.closePath()

    ctx.lineWidth = 1
  }
}
