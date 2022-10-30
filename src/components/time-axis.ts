import { Canvas, Chart, Component } from '../core'

import { formatDate, getTimeTickMark } from '../utils'

export default class TimeAxis extends Component {
  public isZooming: boolean = false

  constructor(chart: Chart) {
    super(chart)
  }

  drawLabels(ctx: CanvasRenderingContext2D) {
    let cols = this.chart.getGridColumns()

    this.chart.clear(ctx)
    ctx.beginPath()
    let size = this.chart.options.timeAxis?.labels?.fontSize || 11
    ctx.fillStyle = this.chart.options.textColor
    ctx.font = size + 'px Verdana'

    for (let i of cols) {
      let point = this.chart.history[i]
      if (!point) continue
      let x = this.chart.getPointX(i)
      let time = getTimeTickMark(point.time)

      ctx.textAlign = 'center'
      ctx.fillText(time, x, 16)
    }

    ctx.stroke()
    ctx.closePath()
  }

  drawTimeMarker(ctx: CanvasRenderingContext2D) {
    let data = this.chart.history
    if (!data) return
    let h = this.chart.getHeight(ctx)
    let x = this.chart.mousePosition.x - this.chart.canvasRect.x
    let i = Math.round(
      ((x - this.chart.boundingRect.left) / this.chart.chartFullWidth) *
        data.length,
    )
    let point = data[i]
    if (!point) return

    let time = formatDate(point.time)

    x = this.chart.getPointX(i)
    ctx.beginPath()
    ctx.fillStyle = this.chart.options.pointer.bgColor
    this.chart.rect(x - 66, 0, 128, h, ctx)
    ctx.fill()
    ctx.closePath()
    ctx.fillStyle = 'white'
    ctx.font = '11px Verdana'
    ctx.fillText(time, x, 20)
  }

  zoom(dx: number) {
    if (this.isZooming) {
      this.chart.transform.zoom(dx / -100, 0)
    }
  }

  update(canvas: Canvas) {
    this.chart.clear(canvas.ctx)
    this.drawLabels(canvas.ctx)

    if (this.chart.pointer.isVisible) {
      this.drawTimeMarker(canvas.ctx)
    }
  }
}
