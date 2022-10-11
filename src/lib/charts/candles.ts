import { Chart } from '../core/chart'

export class CandlesChart extends Chart {
  constructor(container: HTMLElement | string, options?: Chart.Options) {
    super(container, options)
  }

  draw() {
    this.clear(this.ctx)
    this.clear(this.timeAxis.ctx)
    this.clear(this.priceAxis.ctx)

    if (!this.history) {
      this.loading(true)
    } else {
      this.drawGridColumns()
      this.drawGridRows()
      this.timeAxis.update()
      this.priceAxis.update()
      this.drawChart()
      this.pointer.update()

      this.ui.draw()
    }
  }

  drawGridRows() {
    let ctx = this.ctx
    let rows = this.getGridRows()

    ctx.beginPath()
    ctx.strokeStyle = '#7777aa33'

    for (let i of rows) {
      let y = this.normalizeToY(i)
      this.moveTo(0, y, ctx)
      this.lineTo(this.getWidth(ctx), y, ctx)
    }

    ctx.stroke()
    ctx.closePath()
  }

  drawGridColumns() {
    let ctx = this.ctx
    let cols = this.getGridColumns()

    ctx.beginPath()
    ctx.strokeStyle = '#7777aa33'

    for (let i of cols) {
      let x = this.getPointX(i)
      this.moveTo(x, 0, ctx)
      this.lineTo(x, this.mainCanvasHeight, ctx)
    }

    ctx.stroke()
    ctx.closePath()
  }

  drawChart() {
    this.getTopHistoryPrice()
    this.getBottomHistoryPrice()

    let data = this.history

    if (!data?.length) {
      this.log('no history')
      return
    }

    let ctx = this.ctx

    this.moveTo(this.boundingRect.left - 10, this.mainCanvasHeight, ctx)

    for (let i = 0; i < data.length; i++) {
      let x = this.boundingRect.left + i * this.pointsGap
      let halfCandle = this.pointsGap / 4

      if (x > this.mainCanvasWidth + halfCandle) break
      else if (x < -halfCandle) continue

      let { close, open, low, high } = data[i]

      close = this.normalizeToY(close)
      open = this.normalizeToY(open)
      low = this.normalizeToY(low)
      high = this.normalizeToY(high)

      let candleColor =
        close > open
          ? this.options.candles?.colors?.lower
          : this.options.candles?.colors?.higher

      ctx.beginPath()

      this.lineTo(x, high, ctx)
      this.lineTo(x, low, ctx)

      ctx.strokeStyle = candleColor
      ctx.stroke()

      if (halfCandle > 1) {
        this.rect(
          x - this.pointsGap / 4,
          open,
          this.pointsGap / 2,
          close - open,
          ctx,
        )

        ctx.fillStyle = candleColor
        ctx.fill()
      }

      ctx.closePath()
    }
  }
}
