import { defaultChartOptions } from '../config'
import { ChartBoundingRect, ChartOptions } from '../types'

export default abstract class Chart {
  container: HTMLElement | undefined
  options: ChartOptions = defaultChartOptions
  position: ChartBoundingRect
  mousePosition = { x: 0, y: 0 }

  chartContext: CanvasRenderingContext2D
  yAxisContext: CanvasRenderingContext2D
  xAxisContext: CanvasRenderingContext2D

  zoomSpeed: number = 4

  constructor(container: HTMLElement | string, options?: ChartOptions) {
    if(options) this.options = options

    this.chartContext = document.createElement('canvas').getContext('2d')!
    this.yAxisContext = document.createElement('canvas').getContext('2d')!
    this.xAxisContext = document.createElement('canvas').getContext('2d')!

    this.chartContext.lineWidth = 1 * this.getPixelRatio(this.chartContext)

    if (typeof container === 'string') {
      this.container = document.querySelector<HTMLElement>(container)!
    }

    if (!this.container) {
      this.error('no container is found')
      return
    } else {
      this.container.innerHTML = ''
      this.container.style.display = 'grid'
      this.container.style.grid = '1fr 28px / 1fr 70px'
    }

    this.createChartMarkup()

    this.position = {
      left: 0,
      right: this.mainCanvasWidth,
      top: 0,
      bottom: this.mainCanvasHeight,
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

  createXAxis(): HTMLCanvasElement {
    let canvas = this.xAxisContext.canvas
    let ctx = canvas.getContext('2d')!

    this.xAxisContext = ctx

    canvas.style.gridArea = '2 / 1 / 3 / 3'
    canvas.style.width = 'calc(100% - 70px)'
    canvas.style.height = '28px'
    canvas.style.cursor = 'e-resize'

    this.bindXAxisListeners()

    return canvas
  }

  createYAxis(): HTMLCanvasElement {
    let canvas = this.yAxisContext.canvas
    let ctx = canvas.getContext('2d')!

    this.yAxisContext = ctx

    canvas.style.gridArea = '1 / 2 / 2 / 3'
    canvas.style.width = '70px'
    canvas.style.height = '100%'
    canvas.style.cursor = 'n-resize'

    this.bindYAxisListeners()

    return canvas
  }

  createChartMarkup() {
    let chartCanvas = this.createChart()
    let yAxisCanvas = this.createYAxis()
    let xAxisCanvas = this.createXAxis()

    let rect = this.container!.getBoundingClientRect()

    this.setSize(rect.width - 70, rect.height - 28)

    window.addEventListener('resize', () => {
      this.setSize(rect.width, rect.height)
    })

    window.addEventListener('mousemove', (e) =>
      this.windowMouseMoveHandler(e)
    )

    window.addEventListener('mouseup', (e) =>
      this.windowMouseUpHandler(e)
    )

    this.container!.appendChild(chartCanvas)
    this.container!.appendChild(xAxisCanvas)
    this.container!.appendChild(yAxisCanvas)

    this.rescale(this.chartContext)
    this.rescale(this.yAxisContext)
    this.rescale(this.xAxisContext)
  }

  abstract windowMouseMoveHandler(e?: MouseEvent): void
  abstract windowMouseUpHandler(e?: MouseEvent): void

  abstract mouseMoveHandler(e?: MouseEvent): void
  abstract mouseLeaveHandler(e?: MouseEvent): void
  abstract mouseEnterHandler(e?: MouseEvent): void
  abstract mouseDownHandler(e?: MouseEvent): void
  abstract mouseUpHandler(e?: MouseEvent): void
  abstract wheelHandler(e?: WheelEvent): void

  abstract yAxisMouseMoveHandler(e?: MouseEvent): void
  abstract yAxisMouseDownHandler(e?: MouseEvent): void
  abstract yAxisMouseUpHandler(e?: MouseEvent): void
  // abstract yAxisMouseLeaveHandler(e?: MouseEvent): void

  // abstract xAxisMouseMoveHandler(e?: MouseEvent): void
  abstract xAxisMouseDownHandler(e?: MouseEvent): void
  abstract xAxisMouseUpHandler(e?: MouseEvent): void
  // abstract xAxisMouseLeaveHandler(e?: MouseEvent): void

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

  bindYAxisListeners() {
    let canvas = this.yAxisContext.canvas
    canvas.addEventListener('mousemove', (e) => this.yAxisMouseMoveHandler(e))
    canvas.addEventListener('mousedown', (e) => this.yAxisMouseDownHandler(e))
    canvas.addEventListener('mouseup', (e) => this.yAxisMouseUpHandler(e))
    // canvas.addEventListener('mouseleave', (e) => this.yAxisMouseLeaveHandler(e))
  }

  bindXAxisListeners() {
    let canvas = this.xAxisContext.canvas
    // canvas.addEventListener('mousemove', (e) => this.xAxisMouseMoveHandler(e))
    canvas.addEventListener('mousedown', (e) => this.xAxisMouseDownHandler(e))
    canvas.addEventListener('mouseup', (e) => this.xAxisMouseUpHandler(e))
    // canvas.addEventListener('mouseleave', (e) => this.xAxisMouseLeaveHandler(e))
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

  setSize(w: number, h: number) {
    let canvas = this.chartContext.canvas
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
    thickness: number = 1
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
    ctx: CanvasRenderingContext2D
  ) {
    ctx.rect(
      this.getSharpPixel(x, ctx),
      this.getSharpPixel(y, ctx),
      this.getSharpPixel(w, ctx),
      this.getSharpPixel(h, ctx)
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
    this.chartContext.font = '20px Arial'
    this.chartContext.fillText(text, x, y)
  }
}
