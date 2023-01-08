import Configurable from '@/models/configurable'

import { ChartData, ChartLayout, Transform, Button } from '.'
import { createLoader } from './gui'
import { ChartStyle, Pointer, Trading } from '../components'
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

  transform: Transform
  mouse = new Proxy(
    { x: 0, y: 0, cursor: 'default', isBlockedByUI: false, DEFAULT_CURSOR: 'default' },
    {
      set(target, prop, value) {
        if (prop == 'cursor') {
          document.body.style.cursor = value
        } else if (prop == 'isBlockedByUI') {
          const el = document.querySelector('.chart-layout__chart-container')
          el.classList[value ? 'add' : 'remove']('blocked-by-ui')
        }
        // @ts-ignore
        return Reflect.set(...arguments)
      }
    }
  )

  loader: {
    isActive: boolean
  }

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

  get trading() {
    return this.components.trading as Trading
  }

  constructor(container: HTMLElement | string, options?: ChartOptions) {
    super()
    window.xenoview = this

    this.applyOptions(options)
    this.initData(this)

    this.layout = new ChartLayout(this, container)
    this.transform = new Transform(this)
    this.loader = createLoader({
      color: this.options.spinnerColor,
      container: this.container
    })

    this.bindEventListeners()
    this.render()

    this.uiLayer.elements.push(
      new Button(this.chartLayer.raw, 100, 100, {
        text: 'My button',
        textColor: { default: 'white', active: 'black' },
        fillColor: { default: '#ffffff33', hover: '#ffffff55', active: '#fff' },
        border: {
          width: 1,
          color: this._opts.line.color
        },
        padding: {
          x: 4,
          y: 2
        }
      })
    )
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

  public loading(value: boolean | Promise<any>) {
    if (typeof value === 'boolean') {
      this.loader.isActive = value
    } else {
      this.loader.isActive = true
      value.finally(() => {
        this.loader.isActive = false
      })
    }
  }

  private bindEventListeners() {
    this.canvas.addEventListener('mouseenter', () => {
      this.pointer.isVisible = true
    })

    this.canvas.addEventListener('mouseleave', () => {
      this.pointer.isVisible = false
    })

    this.canvas.addEventListener('mousedown', e => {
      if (e.button == 0 && !this.mouse.isBlockedByUI) {
        e.preventDefault()
        this.transform.isPanning = true
      }
    })

    window.addEventListener('mousemove', e => {
      this.mouse.x = e.clientX
      this.mouse.y = e.clientY

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
      this.transform.zoom(e.wheelDeltaY, e.altKey ? -e.wheelDeltaY / 2 : 0, e.ctrlKey ? this.mouse.x : null)

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

  private _debug(text: any, x: number, y: number) {
    this.ctx.fillStyle = 'white'
    this.ctx.font = '12px Arial'
    this.ctx.fillText(text, x, y)
  }
}
