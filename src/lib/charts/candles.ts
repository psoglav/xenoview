import { Chart, ChartStyle } from '../core'

export class Candles extends ChartStyle {
  constructor(chart: Chart) {
    super(chart)
  }

  draw() {
    this.chart.getTopHistoryPrice()
    this.chart.getBottomHistoryPrice()

    let data = this.chart.history

    if (!data?.length) {
      this.chart.log('no history')
      return
    }

    let ctx = this.chart.ctx

    this.chart.moveTo(
      this.chart.boundingRect.left - 10,
      this.chart.mainCanvasHeight,
      ctx
    )

    for (let i = 0; i < data.length; i++) {
      let x = this.chart.boundingRect.left + i * this.chart.pointsGap
      let halfCandle = this.chart.pointsGap / 4

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

      ctx.beginPath()

      this.chart.lineTo(x, high, ctx)
      this.chart.lineTo(x, low, ctx)

      ctx.strokeStyle = candleColor
      ctx.stroke()

      if (halfCandle > 1) {
        this.chart.rect(
          x - this.chart.pointsGap / 4,
          open,
          this.chart.pointsGap / 2,
          close - open,
          ctx
        )

        ctx.fillStyle = candleColor
        ctx.fill()
      }

      ctx.closePath()
    }
  }
}
