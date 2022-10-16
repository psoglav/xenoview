import { Chart } from '../../../core'
import { Candles } from './candles'

export class Bars extends Candles {
  bars = true

  constructor(chart: Chart) {
    super(chart)
  }

  drawCandleBody(x: number, y: number, width: number, height: number) {
    let h = width / 2 - 2
    this.chart.ctx.beginPath()
    this.chart.moveTo(x - h + 1, y)
    this.chart.lineTo(x + width / 2 + 1, y)
    this.chart.moveTo(x + width / 2 + 1, y + height)
    this.chart.lineTo(x + width + h, y + height)
    this.chart.ctx.stroke()
    this.chart.ctx.closePath()
  }
}
