import { Chart } from '../core'
import { Candles } from './candles'

export class Bars extends Candles {
  bars = true

  constructor(chart: Chart) {
    super(chart)
  }

  drawCandleBody(left: number, top: number, right: number, bottom: number) {
    let h = right / 2 - 2
    this.chart.moveTo(left - h + 1, top)
    this.chart.lineTo(left + right / 2 + 1, top)
    this.chart.moveTo(left + right / 2 + 1, top + bottom)
    this.chart.lineTo(left + right + h, top + bottom)
    this.chart.ctx.stroke()
  }
}
