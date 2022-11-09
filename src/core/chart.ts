import '../public/styles/main.css'

import Configurable from '@/models/configurable'

import { ChartData, ChartLayout, Label, Transform, UI, UIElementGroup } from '.'
import { ChartStyle, Loader, Pointer } from '../components'
import { createChartStyle } from '../components/chart-style'
import { ChartOptions, defaultChartOptions } from '../config/chart-options'

export class Chart extends ChartData implements Configurable<ChartOptions> {
  _opts = defaultChartOptions
  layout: ChartLayout

  get options() {
    return this._opts
  }

  get chartLayer() {
    return this.layout.chartLayers.view
  }

  get uiLayer() {
    return this.layout.chartLayers.ui
  }

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

  constructor(container: HTMLElement | string, options?: ChartOptions) {
    super()
    this.applyOptions(options)
    this.initData(this)

    this.layout = new ChartLayout(this, container)
    this.transform = new Transform(this)
    this.loader = new Loader(this)

    this.bindEventListeners()
    this.render()
  }

  applyOptions(opts: ChartOptions): void {
    Object.keys(opts).forEach(option => {
      this._opts[option] = opts[option]
    })
  }

  private render() {
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

  public loadHistory(value: History.Data) {
    this.transform.reset()
    this.history = value
    this.chartData = this.normalizeData()
    this.loading(false)
    this.getHighestAndLowestPrice()
    this.chartLayer.needsUpdate = true
  }

  public setStyle(value: Chart.StyleName) {
    this.options.style = value
    this.chartLayer.components.style = createChartStyle(this)
    this.chartLayer.needsUpdate = true
  }

  public loading(value: boolean) {
    this.loader.isActive = value
  }

  private initUIElements() {
    let h = this.history
    let getPoint = () => this.pointer.focusedPoint || h[h.length - 1]
    let getCandleColor = () => {
      let p = getPoint()
      return p.close < p.open ? this.options?.candles?.colors?.lower : this.options?.candles?.colors?.higher
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
          value: () => this.dataProvider?.currency + ' / TetherUS - BINANCE - CryptoView',
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

  private bindEventListeners() {
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
      this.transform.zoom(e.wheelDeltaY, e.altKey ? -e.wheelDeltaY / 2 : 0, e.ctrlKey ? this.mousePosition.x : null)

      this.pointer.move()
    })
  }

  get canvasRect() {
    return this.ctx.canvas.getBoundingClientRect()
  }

  public toggleAutoScale() {
    this.options.autoScale = !this.options.autoScale
    if (this.options.autoScale) {
      this.boundingRect.top = 0
      this.boundingRect.bottom = this.chartLayer.height
    }
  }

  private debug(text: any, x: number, y: number) {
    this.ctx.fillStyle = 'white'
    this.ctx.font = '12px Arial'
    this.ctx.fillText(text, x, y)
  }
}
