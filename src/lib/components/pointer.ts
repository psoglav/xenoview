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
    y: 0,
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
        this.chart.position.left) /
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

    let ctx = this.chart.chartContext
    let { x, y } = this.position

    x = this.chart.position.left + this.chart.pointsGap * this.focusedPointIndex

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
