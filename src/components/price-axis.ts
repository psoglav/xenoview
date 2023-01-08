import { Canvas, Component } from '../core'
import { MarkModel } from '../models/mark'

export default class PriceAxis extends Component {
  public isZooming: boolean = false

  constructor() {
    super()
  }

  update(canvas: Canvas) {
    this.drawGridLabels(canvas)
    this.drawLastVisiblePrice(canvas)
    this.drawOrdersPrice(canvas)
    this.drawLastPrice(canvas)

    if (this.chart.pointer.isVisible) {
      this.drawPointerPrice(canvas)
    }
  }

  drawGridLabels(canvas: Canvas) {
    let rows = this.chart.getPriceTicks()

    for (let i of rows) {
      let y = this.chart.normalizeToY(i)
      canvas.moveTo(0, y)
      canvas.lineTo(canvas.width, y)

      this.drawLabel(i.toFixed(2), y, canvas, this.chart.options.textColor)
    }
  }

  drawPointerPrice(canvas: Canvas) {
    let y = this.chart.mousePosition.y - this.chart.canvasRect.top
    let price = this.chart.normalizeToPrice(y).toFixed(2)
    this.drawLabel(price, y, canvas, 'white', this.chart.options.pointer.bgColor, true)
  }

  drawLastVisiblePrice(canvas: Canvas) {
    let last = this.chart.lastPoint

    if (this.chart.getPointX(last) < canvas.width) return

    let lastVisible = this.chart.lastVisiblePoint
    if (lastVisible == last) lastVisible = this.chart.history[this.chart.history.length - 2]
    let my = this.chart.normalizeToY(last.close)
    let y = this.chart.normalizeToY(lastVisible.close)

    if (y > my) y = Math.max(y, my + 21)
    else if (y < my) y = Math.min(y, my - 21)

    let type = lastVisible.close < lastVisible.open ? 'lower' : 'higher'
    let color = this.chart.options.candles.colors[type]

    this.drawLabel(lastVisible.close, y, canvas, color, color)
  }

  drawLastPrice(canvas: Canvas) {
    const mark: MarkModel = {
      type: 'primary',
      x: canvas.width / 2,
      y: 0,
      text: null,
      color: null,
      fullWidth: true
    }

    let data = this.chart.history
    if (!data || !data.length) return
    let point = data[data.length - 1]
    let { close, open } = this.chart.normalizePoint(point)

    mark.y = close
    mark.text = point.close.toFixed(2)
    mark.color = this.chart.options.line.color

    if (this.chart.style.bars) {
      let type = close < open ? 'higher' : 'lower'
      mark.color = this.chart.options.candles.colors[type]
    }

    this.chart.ctx.strokeStyle = mark.color
    this.chart.ctx.setLineDash([1, 2])
    this.chart.ctx.beginPath()
    this.chart.chartLayer.moveTo(0, mark.y)
    this.chart.chartLayer.lineTo(this.chart.chartLayer.width, mark.y)
    this.chart.ctx.closePath()
    this.chart.ctx.stroke()

    this.chart.ctx.setLineDash([])

    // this.drawLabel(point.close.toFixed(2), y, canvas, 'white', color, true)

    canvas.drawMark(mark)
  }

  drawOrdersPrice(canvas: Canvas) {
    this.chart.trading.orders.forEach(item => {
      const y = this.chart.normalizeToY(item.deltaPrice + item.price)
      const color = this.chart.options.candles.colors[item.side === 'buy' ? 'higher' : 'lower']
      canvas.drawMark({
        type: 'secondary',
        x: canvas.width / 2,
        y,
        text: (item.deltaPrice + item.price).toFixed(2),
        bg: this.chart.options.bgColor,
        color
      })
    })
  }

  drawLabel(text: any, y: number, canvas: Canvas, fgColor: string, bgColor?: string, fill?: boolean) {
    if (bgColor) {
      canvas.ctx.beginPath()
      canvas.ctx.strokeStyle = bgColor
      canvas.ctx.lineJoin = 'round'

      if (fill) {
        canvas.ctx.lineWidth = 8
        canvas.ctx.fillStyle = bgColor
        canvas.ctx.rect(4, y - 5, canvas.width, 12)
      } else {
        canvas.ctx.lineWidth = 1
        canvas.ctx.fillStyle = this.chart.options.bgColor
        canvas.ctx.rect(0.5, Math.round(y) - 8.5, canvas.width - 1, 20)
      }

      canvas.ctx.fill()
      canvas.ctx.stroke()
      canvas.ctx.closePath()
    }

    canvas.ctx.fillStyle = fgColor
    canvas.ctx.font = '11px Verdana'
    canvas.ctx.fillText(text, 10, y + 5)
  }

  zoom(dy: number) {
    if (this.isZooming) {
      this.chart.transform.zoom(0, dy)
    }
  }
}
