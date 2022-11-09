import { Canvas, Chart, Component } from '../core'
import PriceAxis from './price-axis'

export default class Grid extends Component {
  constructor(chart: Chart) {
    super(chart)
  }

  update(canvas: Canvas): void {
    this.drawRows(canvas.ctx)
    this.drawColumns(canvas.ctx)
  }

  drawRows(ctx: CanvasRenderingContext2D) {
    let rows = this.chart.getPriceTicks()

    ctx.beginPath()
    ctx.strokeStyle = '#7777aa33'

    for (let i of rows) {
      let y = this.chart.normalizeToY(i)
      this.chart.moveTo(0, y, ctx)
      this.chart.lineTo(this.chart.getWidth(ctx), y, ctx)
    }

    ctx.stroke()
    ctx.closePath()
  }

  drawColumns(ctx: CanvasRenderingContext2D) {
    let cols = this.chart.getTimeTicks()

    ctx.beginPath()
    ctx.strokeStyle = '#7777aa33'

    for (let i of cols) {
      let x = this.chart.getPointX(i)
      this.chart.moveTo(x, 0, ctx)
      this.chart.lineTo(x, this.chart.mainCanvasHeight, ctx)
    }

    ctx.stroke()
    ctx.closePath()
  }
}
