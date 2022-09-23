import { toMinutes, normalizeTo } from '../utils'
import { Ticker } from '..'
import { UI, Label, UIElementGroup } from './ui'

import '../public/styles/main.css'

const defaultChartOptions: ChartOptions = {
  bgColor: '#151924',
  textColor: '#b2b5be',
  autoScale: false,
  pointer: {
    bgColor: '#363a45',
    fgColor: '#9598a1',
  },
  candles: {
    colors: {
      higher: '#089981',
      lower: '#f23645',
    },
  },
}

abstract class ChartDataBase {
  history: HistoryData
  chartData: HistoryData
  visiblePoints: HistoryData

  topHistoryPrice: [number, number] = [0, 0]
  bottomHistoryPrice: [number, number] = [0, 0]

  private chart: Chart

  get chartFullWidth() {
    return this.chart.position.right - this.chart.position.left
  }

  constructor() {}

  init(chart: Chart) {
    this.chart = chart
  }

  updatePoint(
    point: HistoryPoint,
    value: { PRICE: number; LASTUPDATE: number },
  ) {
    point.close = value.PRICE
    point.time = value.LASTUPDATE

    if (point.close < point.low) point.low = point.close
    if (point.close > point.high) point.high = point.close
  }

  updateCurrentPoint(value: any) {
    let hist = this.history
    if (!hist?.length) return
    let currentPoint = hist[hist.length - 1]

    if (
      !value?.PRICE ||
      !value?.LASTUPDATE ||
      currentPoint.close === value.PRICE
    )
      return

    let pointMinutesTs = toMinutes(value.LASTUPDATE * 1000)
    let currentPointMinutesTs = toMinutes(currentPoint.time * 1000)

    if (currentPointMinutesTs == pointMinutesTs) {
      this.updatePoint(hist[hist.length - 1], value)
    } else if (pointMinutesTs > currentPointMinutesTs) {
      let pp = hist[hist.length - 1]

      if (value.PRICE < pp.low) pp.low = value.PRICE
      if (value.PRICE > pp.high) pp.high = value.PRICE

      pp.close = value.PRICE

      hist.shift()
      hist.push({
        time: value.LASTUPDATE,
        high: value.PRICE,
        open: value.PRICE,
        close: value.PRICE,
        low: value.PRICE,
      })
    }

    this.draw()
  }

  /**
   * Get point X position.
   * @param {number | HistoryPoint} value a point or an index of it
   * @returns {number} X position
   */
  getPointX(value): number {
    let i = value
    let data = this.history
    if (typeof value == 'object') i = data.indexOf(value)
    return this.chart.position.left + (this.chartFullWidth / data.length) * i
  }

  filterVisiblePoints(data: any[]) {
    return data.filter((_, i) => {
      let x: number = this.getPointX(i)
      return x > 0 && x < this.chart.mainCanvasWidth
    })
  }

  filterVisiblePointsAndCache() {
    if (!this.history) return []
    this.visiblePoints = this.filterVisiblePoints(this.history)
    return this.visiblePoints
  }

  normalizeToPrice(y: number) {
    let minY = this.chart.position.bottom
    let maxY = this.chart.position.top

    let minPrice = this.bottomHistoryPrice[1]
    let maxPrice = this.topHistoryPrice[1]

    return minPrice + normalizeTo(y, minY, maxY, minPrice, maxPrice)
  }

  normalizeToY(price: number) {
    let minY = this.chart.position.bottom
    let maxY = this.chart.position.top

    let minPrice = this.bottomHistoryPrice[1]
    let maxPrice = this.topHistoryPrice[1]

    return minY + normalizeTo(price, minPrice, maxPrice, minY, maxY)
  }

  normalizePoint(point: HistoryPoint): HistoryPoint {
    return {
      ...point,
      close: this.normalizeToY(point.close),
      open: this.normalizeToY(point.open),
      high: this.normalizeToY(point.high),
      low: this.normalizeToY(point.low),
    }
  }

  normalizeData(): HistoryData {
    let hist = this.history
    if (!hist?.length) return []
    return hist.map((point) => this.normalizePoint(point))
  }

  getTopHistoryPrice(): [number, number] {
    let history: any = this.visiblePoints || this.filterVisiblePointsAndCache()
    history = history.map(({ high }) => high)

    let max = history[0]
    let i = 0

    history.forEach((p, ii) => {
      if (p > max) {
        max = p
        i = ii
      }
    })

    this.topHistoryPrice = [i, max]

    return this.topHistoryPrice
  }

  getBottomHistoryPrice(): [number, number] {
    let history: any = this.visiblePoints || this.filterVisiblePointsAndCache()
    history = history.map(({ low }) => low)

    let min = history[0]
    let i = 0

    history.forEach((p, ii) => {
      if (p < min) {
        min = p
        i = ii
      }
    })

    this.bottomHistoryPrice = [i, min]

    return this.bottomHistoryPrice
  }

  abstract draw(): void
}

export default abstract class Chart extends ChartDataBase {
  container: HTMLElement | undefined
  options: ChartOptions = defaultChartOptions
  ticker: Ticker
  ui: UI

  position: ChartBoundingRect
  mousePosition = { x: 0, y: 0 }

  chartContext: CanvasRenderingContext2D
  priceAxisContext: CanvasRenderingContext2D
  timeAxisContext: CanvasRenderingContext2D

  zoomSpeed: number = 1.8
  yZoomFactor = 1.2

  focusedPoint: HistoryPoint | null

  constructor(container: HTMLElement | string, options?: ChartOptions) {
    super()
    this.init(this)

    if (options) this.options = { ...this.options, ...options }

    this.createChartLayout(container)
  }

  loadHistory(value: HistoryData) {
    this.resetChartPosition()
    this.history = value
    this.visiblePoints = null
    this.chartData = this.normalizeData()
    this.initUIElements()
    this.draw()
  }

  setTicker(ticker: Ticker) {
    this.ticker = ticker
    this.draw()
    setInterval(() => {
      this.updateCurrentPoint(ticker.state)
    }, 500)
  }

  resetChartPosition() {
    this.position = {
      top: 35,
      bottom: this.mainCanvasHeight - 35,
      left: this.mainCanvasWidth * -10,
      right: this.mainCanvasWidth,
    }
  }

  createChart(): HTMLCanvasElement {
    let canvas = this.chartContext.canvas

    const preventDefault = function (e: Event) {
      e.preventDefault()
      e.stopPropagation()
    }

    canvas.oncontextmenu = preventDefault
    canvas.onwheel = preventDefault

    canvas.style.gridArea = '1 / 1 / 2 / 2'
    canvas.style.width = '100%'
    canvas.style.height = '100%'
    canvas.style.cursor = 'crosshair'

    this.rescale(this.chartContext)
    this.bindMouseListeners()

    return canvas
  }

  createTimeAxis(): HTMLCanvasElement {
    let canvas = this.timeAxisContext.canvas
    let ctx = canvas.getContext('2d')!

    this.timeAxisContext = ctx

    canvas.style.gridArea = '2 / 1 / 3 / 3'
    canvas.style.width = 'calc(100% - 70px)'
    canvas.style.height = '28px'
    canvas.style.cursor = 'e-resize'

    this.bindTimeAxisListeners()

    return canvas
  }

  createPriceAxis(): HTMLCanvasElement {
    let canvas = this.priceAxisContext.canvas
    let ctx = canvas.getContext('2d')!

    this.priceAxisContext = ctx

    canvas.style.gridArea = '1 / 2 / 2 / 3'
    canvas.style.width = '70px'
    canvas.style.height = '100%'
    canvas.style.cursor = 'n-resize'

    this.bindPriceAxisListeners()

    return canvas
  }

  createChartToolbar() {}

  createChartLayout(container: HTMLElement | string) {
    this.chartContext = document.createElement('canvas').getContext('2d')!
    this.priceAxisContext = document.createElement('canvas').getContext('2d')!
    this.timeAxisContext = document.createElement('canvas').getContext('2d')!

    this.chartContext.lineWidth = 1 * this.getPixelRatio(this.chartContext)

    if (typeof container === 'string') {
      this.container = document.querySelector<HTMLElement>(container)!
    }

    if (!this.container) {
      this.error('no container is found')
      return
    }

    this.container.classList.add('chart-container')
    this.container.innerHTML = ''
    this.container.style.display = 'grid'
    this.container.style.grid = '1fr 28px / 1fr 70px'

    let chartCanvas = this.createChart()
    let priceAxisCanvas = this.createPriceAxis()
    let timeAxisCanvas = this.createTimeAxis()

    let rect = this.container!.getBoundingClientRect()

    this.setSize(rect.width - 70, rect.height - 28, chartCanvas)

    window.addEventListener('resize', () => {
      rect = this.container!.getBoundingClientRect()
      this.setSize(rect.width - 70, rect.height - 28, chartCanvas)
      this.setSize(rect.width - 70, 28, timeAxisCanvas)
      this.setSize(70, rect.height - 28, priceAxisCanvas)
      this.clampXPanning()
      this.draw()
    })

    window.addEventListener('mousemove', (e) => this.windowMouseMoveHandler(e))

    window.addEventListener('mouseup', (e) => this.windowMouseUpHandler(e))

    this.container!.appendChild(chartCanvas)
    this.container!.appendChild(timeAxisCanvas)
    this.container!.appendChild(priceAxisCanvas)

    this.rescale(this.chartContext)
    this.rescale(this.priceAxisContext)
    this.rescale(this.timeAxisContext)

    this.ui = new UI()
  }

  initUIElements() {
    let h = this.history
    let getPoint = () => this.focusedPoint || h[h.length - 1]
    let getCandleColor = () => {
      let p = getPoint()
      return p.close < p.open
        ? this.options?.candles?.colors?.lower
        : this.options?.candles?.colors?.higher
    }

    let commonOpts = () => ({
      x: 0,
      y: 23,
      font: 'Arial',
      size: 13,
      color: this.options?.textColor,
      ctx: this.chartContext,
    })

    let topbarGroup = new UIElementGroup({
      x: 10,
      y: 23,
      gap: 2,
      elements: [
        new Label({
          value: () =>
            this.ticker?.currency + ' / TetherUS - BINANCE - CryptoView',
          ...commonOpts(),
          size: 17,
        }),
        30,
        new Label({
          value: 'O',
          ...commonOpts(),
        }),
        new Label({
          value: () => getPoint().open,
          ...commonOpts(),
          color: getCandleColor,
        }),
        10,
        new Label({
          value: 'H',
          ...commonOpts(),
        }),
        new Label({
          value: () => getPoint().high,
          ...commonOpts(),
          color: getCandleColor,
        }),
        10,
        new Label({
          value: 'L',
          ...commonOpts(),
        }),
        new Label({
          value: () => getPoint().low,
          ...commonOpts(),
          color: getCandleColor,
        }),
        10,
        new Label({
          value: 'C',
          ...commonOpts(),
        }),
        new Label({
          value: () => getPoint().close,
          ...commonOpts(),
          color: getCandleColor,
        }),
      ],
      ctx: this.chartContext,
    })

    this.ui.elements = []
    this.ui.elements.push(topbarGroup)
  }

  abstract clampXPanning(): void

  abstract windowMouseMoveHandler(e?: MouseEvent): void
  abstract windowMouseUpHandler(e?: MouseEvent): void

  abstract mouseMoveHandler(e?: MouseEvent): void
  abstract mouseLeaveHandler(e?: MouseEvent): void
  abstract mouseEnterHandler(e?: MouseEvent): void
  abstract mouseDownHandler(e?: MouseEvent): void
  abstract mouseUpHandler(e?: MouseEvent): void
  abstract wheelHandler(e?: WheelEvent): void

  // abstract priceAxisMouseMoveHandler(e?: MouseEvent): void
  abstract priceAxisMouseDownHandler(e?: MouseEvent): void
  abstract priceAxisMouseUpHandler(e?: MouseEvent): void
  // abstract priceAxisMouseLeaveHandler(e?: MouseEvent): void

  // abstract timeAxisMouseMoveHandler(e?: MouseEvent): void
  abstract timeAxisMouseDownHandler(e?: MouseEvent): void
  abstract timeAxisMouseUpHandler(e?: MouseEvent): void
  // abstract timeAxisMouseLeaveHandler(e?: MouseEvent): void

  bindMouseListeners() {
    let canvas = this.chartContext.canvas
    canvas.addEventListener('mousemove', (e) => {
      this.mousePosition.x = e.clientX
      this.mousePosition.y = e.clientY
      this.mouseMoveHandler(e)
    })
    canvas.addEventListener('mouseleave', (e) => this.mouseLeaveHandler(e))
    canvas.addEventListener('mouseenter', (e) => this.mouseEnterHandler(e))
    canvas.addEventListener('mousedown', (e) => this.mouseDownHandler(e))
    canvas.addEventListener('mouseup', (e) => this.mouseUpHandler(e))
    canvas.addEventListener('wheel', (e) => this.wheelHandler(e))
  }

  bindPriceAxisListeners() {
    let canvas = this.priceAxisContext.canvas
    // canvas.addEventListener('mousemove', (e) => this.priceAxisMouseMoveHandler(e))
    canvas.addEventListener('mousedown', (e) =>
      this.priceAxisMouseDownHandler(e),
    )
    canvas.addEventListener('mouseup', (e) => this.priceAxisMouseUpHandler(e))
    // canvas.addEventListener('mouseleave', (e) => this.priceAxisMouseLeaveHandler(e))
  }

  bindTimeAxisListeners() {
    let canvas = this.timeAxisContext.canvas
    // canvas.addEventListener('mousemove', (e) => this.timeAxisMouseMoveHandler(e))
    canvas.addEventListener('mousedown', (e) =>
      this.timeAxisMouseDownHandler(e),
    )
    canvas.addEventListener('mouseup', (e) => this.timeAxisMouseUpHandler(e))
    // canvas.addEventListener('mouseleave', (e) => this.timeAxisMouseLeaveHandler(e))
  }

  getWidth(ctx: CanvasRenderingContext2D) {
    return ctx.canvas.width * this.getPixelRatio(ctx)
  }

  getHeight(ctx: CanvasRenderingContext2D) {
    return ctx.canvas.height * this.getPixelRatio(ctx)
  }

  get mainCanvasWidth() {
    return (
      this.chartContext.canvas.clientWidth *
      this.getPixelRatio(this.chartContext)
    )
  }

  get mainCanvasHeight() {
    return (
      this.chartContext.canvas.clientHeight *
      this.getPixelRatio(this.chartContext)
    )
  }

  get canvasRect() {
    return this.chartContext.canvas.getBoundingClientRect()
  }

  toggleAutoScale() {
    this.options.autoScale = !this.options.autoScale
    if (this.options.autoScale) {
      this.position.top = 0
      this.position.bottom = this.mainCanvasHeight
      this.yZoomFactor = 1.2
      this.filterVisiblePointsAndCache()
      this.draw()
    }
  }

  setSize(w: number, h: number, canvas: HTMLCanvasElement) {
    canvas.width = w
    canvas.height = h
  }

  rescale(ctx: CanvasRenderingContext2D) {
    let pixelRatio = this.getPixelRatio(ctx)
    let width = ctx.canvas.clientWidth * pixelRatio
    let height = ctx.canvas.clientHeight * pixelRatio
    if (width != ctx.canvas.width) ctx.canvas.width = width
    if (height != ctx.canvas.height) ctx.canvas.height = height

    ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
  }

  getSharpPixel(
    pos: number,
    ctx: CanvasRenderingContext2D,
    thickness: number = 1,
  ): number {
    if (thickness % 2 == 0) {
      return pos
    }
    return pos + this.getPixelRatio(ctx) / 2
  }

  getPixelRatio(context: any) {
    let dpr = window.devicePixelRatio || 1
    let bsr =
      context.webkitBackingStorePixelRatio ||
      context.mozBackingStorePixelRatio ||
      context.msBackingStorePixelRatio ||
      context.oBackingStorePixelRatio ||
      context.backingStorePixelRatio ||
      1

    return dpr / bsr
  }

  moveTo(x: number, y: number, ctx: CanvasRenderingContext2D) {
    ctx.moveTo(this.getSharpPixel(x, ctx), this.getSharpPixel(y, ctx))
  }

  lineTo(x: number, y: number, ctx: CanvasRenderingContext2D) {
    ctx.lineTo(this.getSharpPixel(x, ctx), this.getSharpPixel(y, ctx))
  }

  rect(
    x: number,
    y: number,
    w: number,
    h: number,
    ctx: CanvasRenderingContext2D,
  ) {
    ctx.rect(
      this.getSharpPixel(x, ctx),
      this.getSharpPixel(y, ctx),
      this.getSharpPixel(w, ctx),
      this.getSharpPixel(h, ctx),
    )
  }

  clear(ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, this.getWidth(ctx), this.getHeight(ctx))
  }

  error(msg: string) {
    throw new Error('CryptoView Error: ' + msg)
  }

  log(...msg: any) {
    console.log('CryptoView Log: ', ...msg)
  }

  debug(text: any, x: number, y: number) {
    this.chartContext.fillStyle = 'white'
    this.chartContext.font = '12px Arial'
    this.chartContext.fillText(text, x, y)
  }
}
