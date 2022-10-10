import { Ticker } from '../ticker'
import { UI, Label, UIElementGroup } from '../ui'
import { Pointer, PriceAxis, TimeAxis } from '../components'
import { ChartData } from './chartData'

import '../../public/styles/main.css'

const defaultChartOptions: Chart.Options = {
  bgColor: '#151924',
  textColor: '#b2b5be',
  autoScale: false,
  spinnerColor: '#b2b5be',
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

export abstract class Chart extends ChartData {
  container: HTMLElement | undefined
  options: Chart.Options = defaultChartOptions
  ticker: Ticker
  ui: UI

  position: Chart.Position
  mousePosition = { x: 0, y: 0 }

  chartContext: CanvasRenderingContext2D

  spinnerEl: HTMLElement
  pointer: Pointer
  priceAxis: PriceAxis
  timeAxis: TimeAxis

  zoomSpeed: number = 1.8
  yZoomFactor = 1.2

  focusedPointIndex: number
  focusedPoint: History.Point | null

  constructor(container: HTMLElement | string, options?: Chart.Options) {
    super()
    this.initData(this)

    this.pointer = new Pointer(this)
    this.priceAxis = new PriceAxis(this)
    this.timeAxis = new TimeAxis(this)

    if (options) this.options = { ...this.options, ...options }

    this.createChartLayout(container)
  }

  loadHistory(value: History.Data) {
    this.resetChartPosition()
    this.history = value
    this.visiblePoints = null
    this.chartData = this.normalizeData()
    this.initUIElements()
    this.loading(false)
    this.draw()
  }

  setTicker(ticker: Ticker) {
    this.ticker = ticker
    this.draw()
    setInterval(() => {
      this.updateCurrentPoint(ticker.state)
    }, 500)
  }

  resetChartPosition(full?: boolean) {
    this.position = {
      top: 35,
      bottom: this.mainCanvasHeight - 35,
      left: this.mainCanvasWidth * -10,
      right: this.mainCanvasWidth,
    }

    if (full) {
      this.position.left = 0
      this.filterVisiblePointsAndCache()
    }
  }

  zoom(dx: number, dy: number) {
    if (dx) {
      let zoomPoint = this.mainCanvasWidth
      let d = 20 / this.zoomSpeed

      this.position.right += ((this.position.right - zoomPoint) / d) * dx
      this.position.left += ((this.position.left - zoomPoint) / d) * dx

      this.clampXPanning()
    } else if (dy) {
      let origin = this.mainCanvasHeight / 2
      let d = 20 / (this.zoomSpeed * 2)

      this.position.top -= (((this.position.top - origin) / d) * dy) / 100
      this.position.bottom -= (((this.position.bottom - origin) / d) * dy) / 100
    }

    if (this.options?.autoScale) this.filterVisiblePointsAndCache()
  }

  move(mx: number, my: number) {
    this.position.top += my
    this.position.bottom += my

    if (this.position.right == this.mainCanvasWidth - 200 && mx < 0) return
    if (this.position.left == 0 && mx > 0) return

    this.position.left += mx
    this.position.right += mx

    this.clampXPanning()
    if (this.options?.autoScale) this.filterVisiblePointsAndCache()
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

  createChartToolbar() {}

  createSpinnerSvg() {
    let xmlns = 'http://www.w3.org/2000/svg'
    let boxWidth = '24'
    let boxHeight = '24'

    let svgElem: any = document.createElementNS(xmlns, 'svg')
    svgElem.id = '#cryptoview-spinner'
    svgElem.style.color = this.options.spinnerColor
    svgElem.setAttributeNS(null, 'viewBox', '0 0 24 24')
    svgElem.setAttributeNS(null, 'width', boxWidth)
    svgElem.setAttributeNS(null, 'height', boxHeight)

    svgElem.style.display = 'block'
    svgElem.style.position = 'absolute'
    svgElem.style.left = '50%'
    svgElem.style.top = '50%'
    svgElem.style.transform = 'translate(-50%, -50%) scale(3)'

    let path1 = document.createElementNS(xmlns, 'path')
    path1.setAttributeNS(null, 'fill', 'none')
    path1.setAttributeNS(null, 'd', 'M0 0h24v24H0z')
    svgElem.appendChild(path1)

    let path2: any = document.createElementNS(xmlns, 'path')
    path2.setAttributeNS(
      null,
      'd',
      'M18.364 5.636L16.95 7.05A7 7 0 1 0 19 12h2a9 9 0 1 1-2.636-6.364z',
    )
    path2.style.transformOrigin = '50% 50%'
    path2.setAttributeNS(null, 'fill', 'currentColor')
    svgElem.appendChild(path2)

    path2.style.animation = '1s linear infinite forwards rotate'

    return svgElem
  }

  loading(value: boolean) {
    this.spinnerEl.style.display = value ? 'block' : 'none'
  }

  createChartLayout(container: HTMLElement | string) {
    this.chartContext = document.createElement('canvas').getContext('2d')!
    this.spinnerEl = this.createSpinnerSvg()

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
    this.container.style.position = 'relative'
    this.container.style.grid = '1fr 28px / 1fr 70px'

    let chartCanvas = this.createChart()

    let rect = this.container!.getBoundingClientRect()

    this.setSize(rect.width - 70, rect.height - 28, chartCanvas)

    window.addEventListener('resize', () => {
      rect = this.container!.getBoundingClientRect()
      this.setSize(rect.width - 70, rect.height - 28, chartCanvas)
      this.clampXPanning()
      this.draw()
    })

    window.addEventListener('mousemove', (e) => this.windowMouseMoveHandler(e))

    this.container!.appendChild(chartCanvas)
    this.container!.appendChild(this.timeAxis.canvas)
    this.container!.appendChild(this.priceAxis.canvas)

    this.container!.appendChild(this.spinnerEl)

    this.rescale(this.chartContext)
    this.rescale(this.priceAxis.ctx)
    this.rescale(this.timeAxis.ctx)

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

  abstract mouseMoveHandler(e?: MouseEvent): void
  abstract mouseLeaveHandler(e?: MouseEvent): void
  abstract mouseEnterHandler(e?: MouseEvent): void
  abstract mouseDownHandler(e?: MouseEvent): void
  abstract mouseUpHandler(e?: MouseEvent): void
  abstract wheelHandler(e?: WheelEvent): void

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