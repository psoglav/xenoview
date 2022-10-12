import { Chart } from '../core'
import { Candles } from './candles'

export class HollowCandles extends Candles {
  bars = true

  constructor(chart: Chart) {
    super(chart)
    this.empty = true
  }

  drawCandleBody(
    left: number,
    top: number,
    right: number,
    bottom: number,
    type: string
  ) {
    this.chart.ctx.beginPath()
    this.chart.ctx.rect(
      Math.round(left) + 0.5,
      Math.round(top) + 0.5,
      Math.round(right) + 1,
      Math.round(bottom)
    )
    this.chart.ctx.strokeStyle = this.chart.options.candles?.colors[type]
    this.chart.ctx.stroke()
    this.chart.ctx.closePath()
  }
}
