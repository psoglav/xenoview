import { Chart } from '../core/chart'
import { Component } from '../core/component'

export default class Pointer extends Component {
  public isVisible: Boolean = false

  constructor(chart: Chart) {
    super(chart)
  }

  update() {
    if (!this.chart.chartData?.length || !this.isVisible) return

    let ctx = this.chart.chartContext
    let x =
      this.chart.position.left +
      this.chart.pointsGap * this.chart.focusedPointIndex
    let y = this.chart.mousePosition.y

    ctx.strokeStyle = this.chart.options.pointer.fgColor
    ctx.setLineDash([5, 4])

    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, this.chart.mainCanvasHeight)
    ctx.moveTo(1, y - this.chart.canvasRect.top)
    ctx.lineTo(this.chart.mainCanvasWidth, y - this.chart.canvasRect.top)
    ctx.closePath()
    ctx.stroke()

    ctx.setLineDash([])
  }
}
