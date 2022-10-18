import { Chart, Component } from '../core'
import ChartStyle from '../components/chart-style/chartStyle'

export default class PriceAxis extends Component {
  public canvas: HTMLCanvasElement
  public get ctx() {
    return this.canvas.getContext('2d')
  }

  public isZooming: boolean = false

  constructor(chart: Chart) {
    super(chart)
    this.createCanvas()
    this.bindEventListeners()
  }

  bindEventListeners() {
    this.canvas.addEventListener('mousedown', () => (this.isZooming = true))
    this.canvas.addEventListener('mouseup', () => (this.isZooming = false))
    window.addEventListener('mousemove', e => this.zoom(e?.movementY))
    window.addEventListener('mouseup', () => (this.isZooming = false))
    window.addEventListener('resize', () => {
      let rect = this.chart.container!.getBoundingClientRect()
      this.chart.setSize(70, rect.height - 28, this.canvas)
      this.update()
    })
  }

  createCanvas() {
    this.canvas = document.createElement('canvas')
    this.canvas.style.gridArea = '1 / 2 / 2 / 3'
    this.canvas.style.width = '70px'
    this.canvas.style.height = '100%'
    this.canvas.style.cursor = 'n-resize'

    this.chart.container.appendChild(this.canvas)
    this.chart.rescale(this.ctx)
  }

  drawGridLabels() {
    let rows = this.chart.getGridRows()

    for (let i of rows) {
      let y = this.chart.normalizeToY(i)
      this.chart.moveTo(0, y, this.ctx)
      this.chart.lineTo(this.chart.getWidth(this.ctx), y, this.ctx)

      this.drawLabel(i.toFixed(2), y, this.chart.options.textColor)
    }
  }

  drawPointerPrice() {
    let y = this.chart.mousePosition.y - this.chart.canvasRect.top
    let price = this.chart.normalizeToPrice(y).toFixed(2)
    this.drawLabel(price, y, 'white', this.chart.options.pointer.bgColor, true)
  }

  drawLastVisiblePrice() {
    let last = this.chart.lastPoint

    if (this.chart.getPointX(last) < this.chart.mainCanvasWidth) return

    let lastVisible = this.chart.lastVisiblePoint
    if (lastVisible == last)
      lastVisible = this.chart.history[this.chart.history.length - 2]
    let my = this.chart.normalizeToY(last.close)
    let y = this.chart.normalizeToY(lastVisible.close)

    if (y > my) y = Math.max(y, my + 21)
    else if (y < my) y = Math.min(y, my - 21)

    let type = lastVisible.close < lastVisible.open ? 'lower' : 'higher'
    let color = this.chart.options.candles.colors[type]

    this.drawLabel(lastVisible.close, y, color, color)
  }

  drawLastPrice() {
    let data = this.chart.history
    if (!data || !data.length) return
    let point = data[data.length - 1]
    let { close, open } = this.chart.normalizePoint(point)
    let y = close

    let color = this.chart.options.line.color

    if (this.chart.style.bars) {
      let type = close < open ? 'higher' : 'lower'
      color = this.chart.options.candles.colors[type]
    }

    this.chart.ctx.strokeStyle = color
    this.chart.ctx.setLineDash([1, 2])
    this.chart.ctx.beginPath()
    this.chart.moveTo(0, y)
    this.chart.lineTo(this.chart.mainCanvasWidth, y)
    this.chart.ctx.closePath()
    this.chart.ctx.stroke()

    this.chart.ctx.setLineDash([])

    this.drawLabel(point.close.toFixed(2), y, 'white', color, true)
  }

  drawLabel(
    text: any,
    y: number,
    fgColor: string,
    bgColor?: string,
    fill?: boolean
  ) {
    if (bgColor) {
      this.ctx.beginPath()
      this.ctx.strokeStyle = bgColor
      this.ctx.lineJoin = 'round'

      if (fill) {
        this.ctx.lineWidth = 8
        this.ctx.fillStyle = bgColor
        this.ctx.rect(4, y - 5, this.chart.getWidth(this.ctx), 12)
      } else {
        this.ctx.lineWidth = 1
        this.ctx.fillStyle = this.chart.options.bgColor
        this.ctx.rect(
          0.5,
          Math.round(y) - 8.5,
          this.chart.getWidth(this.ctx)-1,
          20
        )
      }

      this.ctx.fill()
      this.ctx.stroke()
      this.ctx.closePath()
    }

    this.ctx.fillStyle = fgColor
    this.ctx.font = '11px Verdana'
    this.ctx.fillText(text, 10, y + 5)
  }

  zoom(dy: number) {
    if (this.isZooming) {
      this.chart.transform.zoom(0, dy)
    }
  }

  update() {
    this.chart.clear(this.ctx)
    this.drawGridLabels()
    this.drawLastPrice()
    this.drawLastVisiblePrice()

    if (this.chart.pointer.isVisible) {
      this.drawPointerPrice()
    }
  }
}
