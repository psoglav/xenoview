import { Chart, ChartStyle } from '../core'

export class Candles extends ChartStyle {
  bars = true

  constructor(chart: Chart) {
    super(chart)
  }

  draw() {
    this.chart.getTopHistoryPrice()
    this.chart.getBottomHistoryPrice()

    let data = this.chart.history

    this.chart.moveTo(
      this.chart.boundingRect.left - 10,
      this.chart.mainCanvasHeight
    )

    console.log(this.chart.pointsGap)

    for (let i = 0; i < data.length; i++) {
      let x = Math.round(
        this.chart.boundingRect.left + i * this.chart.pointsGap
      )
      let halfCandle = this.chart.pointsGap / 4
      let gap = Math.round(this.chart.pointsGap) + (this.chart.pointsGap % 2)

      if (x > this.chart.mainCanvasWidth + halfCandle) break
      else if (x < -halfCandle) continue

      let { close, open, low, high } = data[i]

      close = this.chart.normalizeToY(close)
      open = this.chart.normalizeToY(open)
      low = this.chart.normalizeToY(low)
      high = this.chart.normalizeToY(high)

      let candleColor =
        close > open
          ? this.chart.options.candles?.colors?.lower
          : this.chart.options.candles?.colors?.higher

      this.chart.ctx.beginPath()

      this.chart.lineTo(x, high)
      this.chart.lineTo(x, low)

      this.chart.ctx.strokeStyle = candleColor
      this.chart.ctx.stroke()

      if (halfCandle > 1.1) {
        this.chart.rect(x - gap / 4 - 1, open, gap / 2, close - open)
        this.chart.ctx.fillStyle = candleColor
        this.chart.ctx.fill()
      }

      this.chart.ctx.closePath()
    }
  }
}
