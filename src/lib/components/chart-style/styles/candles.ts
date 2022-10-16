import { Chart } from '../../../core'
import ChartStyle from '../../../components/chart-style/chartStyle'

export class Candles extends ChartStyle {
  bars = true
  empty = false

  constructor(chart: Chart) {
    super(chart)
  }

  update() {
    this.drawCandles()
  }

  drawCandles() {
    let data = this.chart.history

    for (let i = 0; i < data.length; i++) {
      let x = Math.round(
        this.chart.boundingRect.left + i * this.chart.pointsGap
      )
      let halfCandle = this.chart.pointsGap / 4
      let gap = Math.round(this.chart.pointsGap) + (this.chart.pointsGap % 2)

      if (x > this.chart.mainCanvasWidth + halfCandle) break
      else if (x < -halfCandle) continue

      let { close, open, low, high } = this.chart.normalizePoint(data[i])

      let type = close > open ? 'lower' : 'higher'

      if (this.empty && halfCandle > 1) {
        this.drawCandleStick(x, high, Math.min(open, close), type)
        this.drawCandleStick(x, Math.max(open, close), low, type)
        this.drawCandleBody(x - gap / 4 - 1, open, gap / 2, close - open, type)
      } else {
        this.drawCandleStick(x, high, low, type)
      }

      if (!this.empty && halfCandle > 1) {
        this.drawCandleBody(x - gap / 4 - 1, open, gap / 2, close - open, type)
      }
    }
  }

  drawCandleStick(x: number, top: number, bottom: number, type: string) {
    this.chart.ctx.beginPath()
    this.chart.ctx.moveTo(Math.round(x) + 0.5, Math.round(top) + 0.5)
    this.chart.ctx.lineTo(Math.round(x) + 0.5, Math.round(bottom) + 0.5)
    this.chart.ctx.strokeStyle = this.chart.options.candles?.colors[type]
    this.chart.ctx.stroke()
    this.chart.ctx.closePath()
  }

  drawCandleBody(
    x: number,
    y: number,
    width: number,
    height: number,
    type: string
  ) {
    this.chart.ctx.beginPath()
    this.chart.ctx.rect(
      Math.round(x) + 0.5,
      Math.round(y) + 0.5,
      Math.round(width) + 1,
      Math.round(height)
    )
    this.chart.ctx.fillStyle = this.chart.options.candles?.colors[type]
    this.chart.ctx.fill()
    this.chart.ctx.stroke()
    this.chart.ctx.closePath()
  }
}
