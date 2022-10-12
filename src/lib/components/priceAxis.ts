import { Chart, Component } from '../core'

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

  drawLabels() {
    let rows = this.chart.getGridRows()

    for (let i of rows) {
      let y = this.chart.normalizeToY(i)
      this.chart.moveTo(0, y, this.ctx)
      this.chart.lineTo(this.chart.getWidth(this.ctx), y, this.ctx)

      let fz = 11
      this.ctx.fillStyle = this.chart.options.textColor
      this.ctx.font = fz + 'px Verdana'
      this.ctx.fillText(i.toFixed(2), 10, y - 2 + fz / 2)
    }
  }

  drawPriceMarker() {
    let y = this.chart.mousePosition.y - this.chart.canvasRect.top
    let price = this.chart.normalizeToPrice(y).toFixed(2)

    this.drawMarker(y, this.chart.options.pointer.bgColor, price)
  }

  drawCurrentMarketPriceMarker() {
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

    this.drawMarker(y, color, point.close.toFixed(2))
  }

  drawMarker(y: number, color: string, text: any) {
    this.ctx.beginPath()
    this.ctx.fillStyle = color
    this.ctx.strokeStyle = color
    this.ctx.lineWidth = 8
    this.ctx.lineJoin = 'round'
    this.ctx.rect(4, y - 6, this.chart.getWidth(this.ctx), 16)
    this.ctx.stroke()
    this.ctx.fill()
    this.ctx.closePath()
    this.ctx.fillStyle = 'white'
    this.ctx.font = '11px Verdana'
    this.ctx.fillText(text, 10, y + 5.5)
  }

  zoom(dy: number) {
    if (this.isZooming) {
      this.chart.transform.zoom(0, dy)
      this.chart.draw()
    }
  }

  update() {
    this.chart.clear(this.ctx)
    this.drawLabels()
    this.drawCurrentMarketPriceMarker()

    if (this.chart.pointer.isVisible) {
      this.drawPriceMarker()
    }
  }
}
