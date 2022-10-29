import { Ticker } from '../ticker'
import { Pointer, Loader, ChartStyle } from '../components'
import { ChartData, Transform, ChartLayout, UI, Label, UIElementGroup } from '.'
import { createChartStyle } from '../components/chartStyle'

import '../../public/styles/main.css'

const defaultChartOptions: Chart.Options = {
  style: 'candles',
  bgColor: '#151924',
  textColor: '#b2b5be',
  autoScale: false,
  spinnerColor: '#b2b5be',
  pointer: {
    bgColor: '#363a45',
    fgColor: '#9598a1'
  },
  candles: {
    colors: {
      higher: '#089981',
      lower: '#f23645'
    }
  },
  line: {
    color: '#089981',
    width: 2
  }
}

export class Chart extends ChartData {
  layout: ChartLayout

  get chartLayer() {
    return this.layout.chartLayers.view
  }

  get uiLayer() {
    return this.layout.chartLayers.ui
  }

  options: Chart.Options = defaultChartOptions

  ticker: Ticker
  ui: UI

  transform: Transform
  mousePosition = { x: 0, y: 0 }

  loader: Loader

  get ctx(): CanvasRenderingContext2D {
    return this.chartLayer.ctx
  }

  get canvas(): HTMLCanvasElement {
    return this.chartLayer.canvas
  }

  get container(): HTMLElement {
    return this.layout.layoutContainer
  }

  get boundingRect(): Chart.BoundingRect {
    return this.transform.boundingRect
  }

  set boundingRect(value: Chart.BoundingRect) {
    this.transform.boundingRect = value
  }

  get components() {
    return {
      ...this.uiLayer.components,
      ...this.chartLayer.components
    }
  }

  get style() {
    return this.chartLayer.components.style as ChartStyle
  }

  get pointer() {
    return this.components.pointer as Pointer
  }

  constructor(container: HTMLElement | string, options?: Chart.Options) {
    super()
    this.initData(this)

    if (options) this.options = { ...this.options, ...options }

    this.layout = new ChartLayout(this, container)
    this.transform = new Transform(this)
    this.loader = new Loader(this)

    this.bindEventListeners()
    this.render()
  }

  render() {
    if (this.options.autoScale) {
      this.getHighestAndLowestPrice()
    }

    if (!this.history) {
      this.loading(true)
    } else {
      this.chartLayer.update()
      this.uiLayer.update()
      this.layout.priceAxisCanvas.update()
      this.layout.timeAxisCanvas.update()
    }

    requestAnimationFrame(this.render.bind(this))
  }

  loadHistory(value: History.Data) {
    this.transform.reset()
    this.history = value
    this.chartData = this.normalizeData()
    this.loading(false)
    this.getHighestAndLowestPrice()
    this.chartLayer.needsUpdate = true
  }

  setTicker(ticker: Ticker) {
    this.ticker = ticker
    setInterval(() => {
      this.updateCurrentPoint(ticker.state)
    }, 500)
  }

  setStyle(value: Chart.StyleName) {
    this.options.style = value
    this.chartLayer.components.style = createChartStyle(this)
    this.chartLayer.needsUpdate = true
  }

  loading(value: boolean) {
    this.loader.isActive = value
  }

  initUIElements() {
    let h = this.history
    let getPoint = () => this.pointer.focusedPoint || h[h.length - 1]
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
      ctx: this.ctx
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
          size: 17
        }),
        30,
        new Label({
          value: 'O',
          ...commonOpts()
        }),
        new Label({
          value: () => getPoint().open,
          ...commonOpts(),
          color: getCandleColor
        }),
        10,
        new Label({
          value: 'H',
          ...commonOpts()
        }),
        new Label({
          value: () => getPoint().high,
          ...commonOpts(),
          color: getCandleColor
        }),
        10,
        new Label({
          value: 'L',
          ...commonOpts()
        }),
        new Label({
          value: () => getPoint().low,
          ...commonOpts(),
          color: getCandleColor
        }),
        10,
        new Label({
          value: 'C',
          ...commonOpts()
        }),
        new Label({
          value: () => getPoint().close,
          ...commonOpts(),
          color: getCandleColor
        })
      ],
      ctx: this.ctx
    })

    this.ui.elements = []
    this.ui.elements.push(topbarGroup)
  }

  bindEventListeners() {
    this.canvas.addEventListener('mouseenter', () => {
      this.pointer.isVisible = true
    })

    this.canvas.addEventListener('mouseleave', () => {
      this.pointer.isVisible = false
    })

    this.canvas.addEventListener('mousedown', e => {
      if (e.button == 0) {
        e.preventDefault()
        this.transform.isPanning = true
      }
    })

    window.addEventListener('mousemove', e => {
      this.mousePosition.x = e.clientX
      this.mousePosition.y = e.clientY

      if (this.transform.isPanning) {
        let mx = e.movementX
        let my = this.options.autoScale ? 0 : e.movementY
        this.transform.move(mx, my)
      }

      this.pointer.move()
    })

    window.addEventListener('mouseup', e => {
      if (e.button == 0) {
        this.transform.isPanning = false
      }
    })

    this.canvas.addEventListener('wheel', (e: any) => {
      this.transform.zoom(
        e.wheelDeltaY,
        e.altKey ? -e.wheelDeltaY / 2 : 0,
        e.ctrlKey ? this.mousePosition.x : null
      )

      this.pointer.move()
    })
  }

  getWidth(ctx: CanvasRenderingContext2D) {
    return ctx.canvas.width * this.getPixelRatio(ctx)
  }

  getHeight(ctx: CanvasRenderingContext2D) {
    return ctx.canvas.height * this.getPixelRatio(ctx)
  }

  get mainCanvasWidth() {
    return this.canvas.clientWidth
  }

  get mainCanvasHeight() {
    return this.canvas.clientHeight
  }

  get canvasRect() {
    return this.ctx.canvas.getBoundingClientRect()
  }

  toggleAutoScale() {
    this.options.autoScale = !this.options.autoScale
    if (this.options.autoScale) {
      this.boundingRect.top = 0
      this.boundingRect.bottom = this.mainCanvasHeight
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

  moveTo(x: number, y: number, ctx?: CanvasRenderingContext2D) {
    if (!ctx) ctx = this.ctx
    ctx.moveTo(
      this.getSharpPixel(Math.round(x), ctx),
      this.getSharpPixel(Math.round(y), ctx)
    )
  }

  lineTo(x: number, y: number, ctx?: CanvasRenderingContext2D) {
    if (!ctx) ctx = this.ctx
    ctx.lineTo(
      this.getSharpPixel(Math.round(x), ctx),
      this.getSharpPixel(Math.round(y), ctx)
    )
  }

  rect(
    x: number,
    y: number,
    w: number,
    h: number,
    ctx?: CanvasRenderingContext2D
  ) {
    if (!ctx) ctx = this.ctx
    ctx.rect(
      this.getSharpPixel(Math.round(x) + 0.5, ctx),
      this.getSharpPixel(Math.round(y) + 0.5, ctx),
      this.getSharpPixel(Math.round(w) + 0.5, ctx),
      this.getSharpPixel(Math.round(h) + 0.5, ctx)
    )
  }

  circle(x: number, y: number, radius: number, ctx?: CanvasRenderingContext2D) {
    if (!ctx) ctx = this.ctx
    ctx.beginPath()
    x = this.getSharpPixel(Math.round(x) + 0.5, ctx)
    y = this.getSharpPixel(Math.round(y) + 0.5, ctx)
    ctx.arc(x, y, radius, 0, 2 * Math.PI, false)
    ctx.fill()
    ctx.stroke()
    ctx.closePath()
  }

  clear(ctx?: CanvasRenderingContext2D) {
    if (!ctx) ctx = this.ctx
    ctx.clearRect(0, 0, this.getWidth(ctx), this.getHeight(ctx))
  }

  error(msg: string) {
    throw new Error('CryptoView Error: ' + msg)
  }

  log(...msg: any) {
    console.log('CryptoView Log: ', ...msg)
  }

  debug(text: any, x: number, y: number) {
    this.ctx.fillStyle = 'white'
    this.ctx.font = '12px Arial'
    this.ctx.fillText(text, x, y)
  }
}
