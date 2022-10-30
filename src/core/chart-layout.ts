import { Chart, Canvas } from '.'
import { Pointer, Grid, TimeAxis, PriceAxis } from '../components'
import { createChartStyle } from '../components/chart-style'

export class ChartLayout {
  chart: Chart
  layoutContainer: HTMLElement

  chartContainer: HTMLElement
  priceContainer: HTMLElement
  timeContainer: HTMLElement

  priceAxisCanvas: Canvas
  timeAxisCanvas: Canvas

  chartLayers: {
    view?: Canvas
    ui?: Canvas
  } = {}

  constructor(chart: Chart, container: HTMLElement | string) {
    this.chart = chart
    this.create(container)
  }

  ctx(canvas: HTMLCanvasElement) {
    return canvas.getContext('2d')
  }

  create(container: HTMLElement | string) {
    if (typeof container === 'string') {
      this.layoutContainer = document.querySelector<HTMLElement>(container)!
    }

    if (!this.layoutContainer) {
      this.chart.error('no container is found')
    } else {
      this.layoutContainer.classList.add('chart-container')
      this.layoutContainer.innerHTML = ''
      this.layoutContainer.style.display = 'grid'
      this.layoutContainer.style.position = 'absolute'
      this.layoutContainer.style.top = '0'
      this.layoutContainer.style.left = '0'

      this.layoutContainer.style.grid = '1fr 28px / 1fr 70px'

      this.createChartContainer()
      this.createPriceContainer()
      this.createTimeContainer()
    }
  }

  createChartContainer() {
    const el = this.createContainer()

    this.chartContainer = el

    el.style.gridArea = '1 / 1 / 2 / 2'
    el.style.width = '100%'
    el.style.height = '100%'
    el.style.cursor = 'crosshair'

    this.chartLayers.view = new Canvas({
      container: el,
      zIndex: 0,
      // updateByRequest: true,
      components: {
        grid: new Grid(this.chart),
        style: createChartStyle(this.chart)
      }
    })

    this.chartLayers.ui = new Canvas({
      container: el,
      zIndex: 1,
      components: {
        pointer: new Pointer(this.chart)
      }
    })

    this.chartLayers.ui.canvas.style.pointerEvents = 'none'

    const observer = new ResizeObserver(() => {
      if (!this.chart.transform) return
      this.chart.transform.clamp()
    })

    observer.observe(el)
  }

  createPriceContainer() {
    const el = this.createContainer()

    el.style.gridArea = '1 / 2 / 2 / 3'
    el.style.width = '70px'
    el.style.height = '100%'
    el.style.cursor = 'n-resize'

    this.priceContainer = el

    const priceAxis = new PriceAxis(this.chart)

    this.priceAxisCanvas = new Canvas({
      container: el,
      // updateByRequest: true,
      components: {
        priceAxis
      }
    })

    el.addEventListener('mousedown', () => (priceAxis.isZooming = true))
    el.addEventListener('mouseup', () => (priceAxis.isZooming = false))
    window.addEventListener('mousemove', e => priceAxis.zoom(e?.movementY))
    window.addEventListener('mouseup', () => (priceAxis.isZooming = false))
    window.addEventListener('resize', () => {
      let rect = el.getBoundingClientRect()
      this.chart.setSize(
        this.priceAxisCanvas.width,
        rect.height - this.timeAxisCanvas.height,
        this.priceAxisCanvas.raw
      )
    })
  }

  createTimeContainer() {
    const el = this.createContainer()

    el.style.gridArea = '2 / 1 / 3 / 2'
    el.style.width = '100%'
    el.style.height = '28px'
    el.style.cursor = 'e-resize'

    this.timeContainer = el

    const timeAxis = new TimeAxis(this.chart)

    this.timeAxisCanvas = new Canvas({
      container: el,
      components: {
        timeAxis
      }
    })

    el.addEventListener('mousedown', () => (timeAxis.isZooming = true))
    el.addEventListener('mouseup', () => (timeAxis.isZooming = false))
    window.addEventListener('mousemove', e => timeAxis.zoom(e.movementX))
    window.addEventListener('mouseup', () => (timeAxis.isZooming = false))
    window.addEventListener('resize', () => {
      let rect = el.getBoundingClientRect()
      this.chart.setSize(
        rect.width,
        this.timeAxisCanvas.height,
        this.timeAxisCanvas.canvas
      )
    })
  }

  createContainer(): HTMLElement {
    const el = document.createElement('div')
    el.style.position = 'relative'
    this.layoutContainer.appendChild(el)
    return el
  }
}
