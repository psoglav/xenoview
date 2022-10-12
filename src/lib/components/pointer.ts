import { Chart, Component } from '../core'

type PointerPosition = {
  x: number
  y: number
}

export default class Pointer extends Component {
  public isVisible: Boolean = false
  public focusedPointIndex: number
  public focusedPoint: History.Point

  private position: PointerPosition = {
    x: 0,
    y: 0
  }

  constructor(chart: Chart) {
    super(chart)
  }

  move() {
    let data = this.chart.chartData

    if (!data?.length) return

    let x =
      ((this.chart.mousePosition.x -
        this.chart.canvasRect.x -
        this.chart.boundingRect.left) /
        this.chart.chartFullWidth) *
      data.length

    let i = Math.round(x)
    i = i > data.length - 1 ? data.length - 1 : i < 0 ? 0 : i

    this.focusedPointIndex = i
    this.focusedPoint = this.chart.history[i]

    this.position.y = this.chart.mousePosition.y
  }

  update() {
    if (!this.chart.chartData?.length || !this.isVisible) return
    this.chart.ctx.strokeStyle = this.chart.options.pointer.fgColor

    this.chart.ctx.setLineDash([5, 8])

    this.drawVerticalLine()
    this.drawHorizontalLine()

    this.chart.ctx.setLineDash([])
  }

  drawVerticalLine() {
    let ctx = this.chart.ctx
    let x = Math.round(
      this.chart.boundingRect.left +
        this.chart.pointsGap * this.focusedPointIndex
    ) + 0.5

    this.chart.ctx.lineDashOffset = (this.chart.mainCanvasHeight % 2)

    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, this.chart.mainCanvasHeight)
    ctx.closePath()
    ctx.stroke()
    this.chart.ctx.lineDashOffset = 0
  }

  drawHorizontalLine() {
    let ctx = this.chart.ctx
    let y = Math.round((this.position.y + (this.chart.mainCanvasHeight % 2) / 2) - this.chart.canvasRect.top) + 0.5

    this.chart.ctx.lineDashOffset = (this.chart.mainCanvasWidth % 2) / 2

    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(this.chart.mainCanvasWidth, y)
    ctx.closePath()
    ctx.stroke()
    this.chart.ctx.lineDashOffset = 0
  }
}
