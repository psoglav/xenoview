import { Chart, ChartStyle } from '../core'

export class Candles extends ChartStyle {
  bars = true

  constructor(chart: Chart) {
    super(chart)
  }

  draw() {
    this.chart.getTopHistoryPrice()
    this.chart.getBottomHistoryPrice()
    this.drawCandles()
  }

  drawCandles() {
    let data = this.chart.history

    this.chart.moveTo(
      this.chart.boundingRect.left - 10,
      this.chart.mainCanvasHeight
    )

    for (let i = 0; i < data.length; i++) {
      let x = Math.round(
        this.chart.boundingRect.left + i * this.chart.pointsGap
      )
      let halfCandle = this.chart.pointsGap / 4
      let gap = Math.round(this.chart.pointsGap) + (this.chart.pointsGap % 2)

      if (x > this.chart.mainCanvasWidth + halfCandle) break
      else if (x < -halfCandle) continue

      let { close, open, low, high } = this.chart.normalizePoint(data[i])

      let color =
        this.chart.options.candles?.colors[close > open ? 'lower' : 'higher']

      this.chart.ctx.beginPath()

      this.drawCandleStick(x, high, low, color)

      if (halfCandle > 1) {
        this.drawCandleBody(x - gap / 4 - 1, open, gap / 2, close - open, color)
      }

      this.chart.ctx.closePath()
    }
  }

  drawCandleStick(x: number, top: number, bottom: number, color: string) {
    this.chart.moveTo(x, top)
    this.chart.lineTo(x, bottom)
    this.chart.ctx.strokeStyle = color
    this.chart.ctx.stroke()
  }

  drawCandleBody(
    left: number,
    top: number,
    right: number,
    bottom: number,
    color: string
  ) {
    this.chart.rect(left, top, right, bottom)
    this.chart.ctx.fillStyle = color
    this.chart.ctx.fill()
  }
}
