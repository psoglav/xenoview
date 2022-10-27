import { Canvas, Chart, Component } from '../core'

import { formatDate, parseTimeLabel } from '../../utils'

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
      let x = this.chart.getPointX(i)
      let time = getTimeFromTimestamp(point.time * 1000)

      ctx.fillText(time, x - 16, 16)
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
    this.chart.rect(x - 60, 0, 118, h, ctx)
    ctx.fill()
    ctx.closePath()
    ctx.fillStyle = 'white'
    ctx.font = '11px Verdana'
    ctx.fillText(time, x - 50, 20)
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
