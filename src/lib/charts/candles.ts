import { getFullTimeFromTimestamp, getTimeFromTimestamp } from '../../utils'

import { Chart } from '../core/chart'

export class CandlesChart extends Chart {
  private panningIsActive = false
  private isZoomingTimeAxis = false

  constructor(container: HTMLElement | string, options?: Chart.Options) {
    super(container, options)
  }

  draw() {
    this.clear(this.chartContext)
    this.clear(this.timeAxisContext)
    this.clear(this.priceAxis.ctx)

    if (!this.history) {
      this.loading(true)
    } else {
      this.drawGridColumns()
      this.drawGridRows()
      this.drawTimeAxisLabels()
      this.priceAxis.update()
      this.drawChart()
      this.pointer.update()
      this.drawCurrentMarketPriceMarker()

      if (this.pointer.isVisible) {
        this.drawTimeMarker()
      }

      this.ui.draw()
      this.mainDebug()
    }
  }

  zoomChart(side: number) {
    let zoomPoint = this.mainCanvasWidth
    let d = 20 / this.zoomSpeed

    this.position.right += ((this.position.right - zoomPoint) / d) * side
    this.position.left += ((this.position.left - zoomPoint) / d) * side

    this.clampXPanning()
    if (this.options?.autoScale) this.filterVisiblePointsAndCache()
  }

  moveChart(mx: number, my: number) {
    this.position.top += my
    this.position.bottom += my

    if (this.position.right == this.mainCanvasWidth - 200 && mx < 0) return
    if (this.position.left == 0 && mx > 0) return

    this.position.left += mx
    this.position.right += mx

    this.clampXPanning()
    if (this.options?.autoScale) this.filterVisiblePointsAndCache()
  }

  clampXPanning() {
    if (this.position.left > 0) this.position.left = 0
    if (this.position.right < this.mainCanvasWidth - 200)
      this.position.right = this.mainCanvasWidth - 200
  }

  movePointer() {
    let data = this.chartData

    if (!data?.length) return

    let x = this.mousePosition.x - this.canvasRect.x
    x = ((x - this.position.left) / this.chartFullWidth) * data.length

    let i = Math.round(x)

    this.focusedPointIndex =
      i > data.length - 1 ? data.length - 1 : i < 0 ? 0 : i
    this.focusedPoint = this.history[this.focusedPointIndex]
  }

  drawCurrentMarketPriceMarker() {
    let ctx = this.chartContext
    let data = this.history
    if (!data || !data.length) return
    let point = data[data.length - 1]
    let { close, open } = this.normalizePoint(point)
    let y = close

    let type = close < open ? 'higher' : 'lower'

    ctx.strokeStyle = this.options.candles.colors[type]
    ctx.setLineDash([1, 2])
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(this.mainCanvasWidth, y)
    ctx.closePath()
    ctx.stroke()

    ctx.setLineDash([])

    ctx = this.priceAxis.ctx

    ctx.beginPath()
    ctx.fillStyle = this.options.candles.colors[type]
    this.rect(0, y - 10, this.getWidth(ctx), 20, ctx)
    ctx.fill()
    ctx.closePath()
    ctx.fillStyle = 'white'
    ctx.font = '11px Verdana'
    ctx.fillText(point.close.toFixed(2), 10, y + 5.5)
  }

  drawTimeMarker() {
    let ctx = this.timeAxisContext
    let data = this.history
    if (!data) return
    let h = this.getHeight(ctx)
    let x = this.mousePosition.x - this.canvasRect.x
    let i = Math.round(
      ((x - this.position.left) / this.chartFullWidth) * data.length,
    )
    let point = data[i]
    if (!point) return

    if (point.time.toString().length != 13) point.time *= 1000
    let time = getFullTimeFromTimestamp(point.time)

    x = this.getPointX(i)
    ctx.beginPath()
    ctx.fillStyle = this.options.pointer.bgColor
    this.rect(x - 60, 0, 118, h, ctx)
    ctx.fill()
    ctx.closePath()
    ctx.fillStyle = 'white'
    ctx.font = '11px Verdana'
    ctx.fillText(time, x - 50, 20)
  }

  getGridColumns() {
    let prev = 0
    return this.history
      .map((_, i) => i)
      .filter((i) => {
        let x = this.getPointX(i)
        let px = this.getPointX(prev)

        if (x - px < 100 && x != px) {
          return 0
        }

        prev = i
        return 1
      })
  }

  drawGridRows() {
    let ctx = this.chartContext
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
    let ctx = this.chartContext
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

  drawTimeAxisLabels() {
    let ctx = this.timeAxisContext
    let cols = this.getGridColumns()

    this.clear(ctx)
    ctx.beginPath()
    let size = this.options.timeAxis?.labels?.fontSize || 11
    ctx.fillStyle = this.options.textColor
    ctx.font = size + 'px Verdana'

    for (let i of cols) {
      let point = this.history[i]
      let x = this.getPointX(i)
      let time = getTimeFromTimestamp(point.time * 1000)

      ctx.fillText(time, x - 16, 16)
    }

    ctx.stroke()
    ctx.closePath()
  }

  drawPriceAxis() {
    let ctx = this.chartContext
    let priceAxisCtx = this.priceAxis.ctx

    let segments = 20,
      h = this.mainCanvasHeight,
      w = this.mainCanvasWidth

    let t = this.topHistoryPrice[1]
    let b = this.bottomHistoryPrice[1]

    let r = 1,
      tr = 0,
      br = 0

    let round = (n: number) => Math.round(n / r) * r

    while (tr == br) {
      tr = round(t)
      br = round(b)
      if (tr == br) r += 10
    }

    let normalize = (y: number) => ((y - br) / (tr - br)) * h
    let reverse = (y: number) => h - y

    let convert = (y: number) => reverse(normalize(y))

    this.clear(priceAxisCtx)
    ctx.beginPath()

    ctx.strokeStyle = '#7777aa33'

    tr = convert(tr)
    br = convert(br)

    let hh = Math.abs((tr - br) / 2)

    let k = Math.abs(this.yZoomFactor)

    tr = (tr - hh) / k + hh
    br = (br - hh) / k + hh

    let step = (tr - br) / segments

    while (step > -30) {
      segments -= segments / 5
      step = (tr - br) / segments
    }

    while (step < -80) {
      segments += segments / 5
      step = (tr - br) / segments
    }

    let segmentsOut = 0

    while (tr > segmentsOut * Math.abs(step)) {
      segmentsOut++
    }

    for (let i = segments + segmentsOut; i >= -segmentsOut; i--) {
      let y = i * step
      this.moveTo(0, y + br, ctx)
      this.lineTo(w, y + br, ctx)

      let fz = 11
      priceAxisCtx.fillStyle = this.options.textColor
      priceAxisCtx.font = fz + 'px Verdana'
      let price = i * ((t - b) / segments)
      priceAxisCtx.fillText(
        round(price + b).toFixed(2),
        10,
        y + br - 2 + fz / 2,
      )
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

    let ctx = this.chartContext

    this.moveTo(this.position.left - 10, this.mainCanvasHeight, ctx)

    for (let i = 0; i < data.length; i++) {
      let x = this.position.left + i * this.pointsGap
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

  zoomPriceAxis(dy: number) {
    if (this.priceAxis.isZooming && dy) {
      let origin = this.mainCanvasHeight / 2
      let d = 20 / (this.zoomSpeed * 2)

      this.position.top -= (((this.position.top - origin) / d) * dy) / 100
      this.position.bottom -= (((this.position.bottom - origin) / d) * dy) / 100

      this.draw()
    }
  }

  zoomTimeAxis(mx) {
    if (this.isZoomingTimeAxis && mx) {
      let zoomPoint = this.mainCanvasWidth
      let d = 20 / this.zoomSpeed

      this.position.right +=
        (((this.position.right - zoomPoint) / d) * mx) / 100
      this.position.left += (((this.position.left - zoomPoint) / d) * mx) / 100

      this.clampXPanning()
      if (this.options?.autoScale) this.filterVisiblePointsAndCache()
      this.draw()
    }
  }

  windowMouseMoveHandler(e: MouseEvent) {
    this.zoomTimeAxis(e?.movementX)
    this.zoomPriceAxis(e?.movementY)
  }

  windowMouseUpHandler(e: MouseEvent) {
    this.isZoomingTimeAxis = false
  }

  mouseMoveHandler(e: MouseEvent) {
    if (this.panningIsActive) {
      let mx = e.movementX
      let my = this.options.autoScale ? 0 : e.movementY
      this.moveChart(mx, my)
    }

    this.movePointer()
    this.draw()
  }

  mouseEnterHandler() {
    this.pointer.isVisible = true
  }

  mouseLeaveHandler() {
    this.pointer.isVisible = false
    this.panningIsActive = false
    this.focusedPoint = null

    this.draw()
  }

  mouseDownHandler(e: MouseEvent) {
    if (e.button == 0) {
      e.preventDefault()
      this.panningIsActive = true
    }
  }

  mouseUpHandler(e: MouseEvent) {
    if (e.button == 0) {
      this.panningIsActive = false
    }
  }

  wheelHandler(e: any) {
    let cs = this.pointsGap
    let wd = e.wheelDeltaY
    if (wd < 0 && cs < 1.7) return
    if (wd > 0 && cs > 350) return

    this.zoomChart(wd > 1 ? 1 : -1)
    this.movePointer()
    this.draw()
  }

  timeAxisMouseDownHandler(e?: MouseEvent): void {
    this.isZoomingTimeAxis = true
  }

  timeAxisMouseUpHandler(e?: MouseEvent): void {
    this.isZoomingTimeAxis = false
  }

  mainDebug() {
    // let { top, bottom } = this.position
    // let y = 50
    // let minY = this.position.top
    // let maxY = this.position.bottom
    // let minPrice = this.bottomHistoryPrice[1]
    // let maxPrice = this.topHistoryPrice[1]
    // this.debug('top: ' + top, 100, (y += 20))
    // this.debug('bottom: ' + bottom, 100, (y += 20))
    // this.debug('my: ' + this.mousePosition.y, 100, (y += 20))
    // this.debug('minY: ' + minY, 100, (y += 20))
    // this.debug('maxY: ' + maxY, 100, (y += 20))
    // this.debug('minPrice: ' + minPrice, 100, (y += 20))
    // this.debug('maxPrice: ' + maxPrice, 100, (y += 20))
    // this.debug(
    //   'myPrice: ' + this.normalizeToPrice(this.mousePosition.y),
    //   100,
    //   (y += 20),
    // )
  }
}
