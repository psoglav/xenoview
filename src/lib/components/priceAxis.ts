import { Canvas, Chart, Component } from '../core'

export default class PriceAxis extends Component {
  public isZooming: boolean = false

  constructor(chart: Chart) {
    super(chart)
  }

  drawGridLabels(ctx: CanvasRenderingContext2D) {
    let rows = this.chart.getPriceTicks()

    for (let i of rows) {
      let y = this.chart.normalizeToY(i)
      this.chart.moveTo(0, y, ctx)
      this.chart.lineTo(this.chart.getWidth(ctx), y, ctx)

      this.drawLabel(i.toFixed(2), y, ctx, this.chart.options.textColor)
    }
  }

  drawPointerPrice(ctx: CanvasRenderingContext2D) {
    let y = this.chart.mousePosition.y - this.chart.canvasRect.top
    let price = this.chart.normalizeToPrice(y).toFixed(2)
    this.drawLabel(
      price,
      y,
      ctx,
      'white',
      this.chart.options.pointer.bgColor,
      true
    )
  }

  drawLastVisiblePrice(ctx: CanvasRenderingContext2D) {
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

    this.drawLabel(lastVisible.close, y, ctx, color, color)
  }

  drawLastPrice(ctx: CanvasRenderingContext2D) {
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

    this.drawLabel(point.close.toFixed(2), y, ctx, 'white', color, true)
  }

  drawLabel(
    text: any,
    y: number,
    ctx: CanvasRenderingContext2D,
    fgColor: string,
    bgColor?: string,
    fill?: boolean
  ) {
    if (bgColor) {
      ctx.beginPath()
      ctx.strokeStyle = bgColor
      ctx.lineJoin = 'round'

      if (fill) {
        ctx.lineWidth = 8
        ctx.fillStyle = bgColor
        ctx.rect(4, y - 5, this.chart.getWidth(ctx), 12)
      } else {
        ctx.lineWidth = 1
        ctx.fillStyle = this.chart.options.bgColor
        ctx.rect(0.5, Math.round(y) - 8.5, this.chart.getWidth(ctx) - 1, 20)
      }

      ctx.fill()
      ctx.stroke()
      ctx.closePath()
    }

    ctx.fillStyle = fgColor
    ctx.font = '11px Verdana'
    ctx.fillText(text, 10, y + 5)
  }

  zoom(dy: number) {
    if (this.isZooming) {
      this.chart.transform.zoom(0, dy)
    }
  }

  update(canvas: Canvas) {
    this.chart.clear(canvas.ctx)
    this.drawGridLabels(canvas.ctx)
    this.drawLastPrice(canvas.ctx)
    this.drawLastVisiblePrice(canvas.ctx)

    if (this.chart.pointer.isVisible) {
      this.drawPointerPrice(canvas.ctx)
    }
  }
}
