import { Chart, UI, Canvas, CanvasOptions } from '.'
import { Pointer } from '../components'
import { createChartStyle, Area } from '../components/chart-style/styles'

export class ChartLayout {
  chart: Chart
  layoutContainer: HTMLElement

  chartContainer: HTMLElement
  priceContainer: HTMLElement
  timeContainer: HTMLElement

  layers: {
    chart?: Canvas
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

      // this.chart.ui = new UI()
    }
  }

  createChartContainer() {
    const el = this.createContainer()

    this.chartContainer = el

    el.style.gridArea = '1 / 1 / 2 / 2'
    el.style.width = '100%'
    el.style.height = '100%'
    el.style.cursor = 'crosshair'

    this.layers.chart = new Canvas({
      container: el,
      zIndex: 0,
      panning: true,
      components: {
        style: createChartStyle(this.chart)
      }
    })

    this.layers.ui = new Canvas({
      container: el,
      zIndex: 1,
      components: {
        pointer: new Pointer(this.chart)
      }
    })

    this.layers.ui.canvas.style.pointerEvents = 'none'

    let rect = el.getBoundingClientRect()

    const observer = new ResizeObserver(() => {
      if (!this.chart.transform) return
      // rect = el.getBoundingClientRect()
      //
      // Object.values(this.layers).forEach(canvas => {
      // canvas.fitToParent()
      // })

      this.chart.transform.clamp()
      // this.chart.draw()
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
  }

  createTimeContainer() {
    const el = this.createContainer()
    el.style.gridArea = '2 / 1 / 3 / 3'
    el.style.width = 'calc(100% - 70px)'
    el.style.height = '28px'
    el.style.cursor = 'e-resize'
    this.timeContainer = el
  }

  createContainer(): HTMLElement {
    const el = document.createElement('div')
    el.style.position = 'relative'
    this.layoutContainer.appendChild(el)
    return el
  }
}
