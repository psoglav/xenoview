import { Chart } from '../../../core'
import { Candles } from './candles'

export class HollowCandles extends Candles {
  bars = true

  constructor(chart: Chart) {
    super(chart)
    this.empty = true
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
    this.chart.ctx.strokeStyle = this.chart.options.candles?.colors[type]
    this.chart.ctx.stroke()
    this.chart.ctx.closePath()
  }
}
