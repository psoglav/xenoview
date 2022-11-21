import '../public/styles/main.css'

import { Canvas, Chart } from '.'
import { Grid, Pointer, PriceAxis, TimeAxis, Legend } from '../components'
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
      throw new Error('no container is found')
    } else {
      this.layoutContainer.classList.add('chart-layout')
      this.layoutContainer.innerHTML = ''

      this.createChartContainer()
      this.createPriceContainer()
      this.createTimeContainer()
      this.createLegendContainer()
    }
  }

  createChartContainer() {
    const el = this.createContainer()

    el.classList.add('chart-layout__chart-container')

    this.chartContainer = el

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

    el.classList.add('chart-layout__price-scale-container')

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
      this.priceAxisCanvas.setSize(this.priceAxisCanvas.width, rect.height - this.timeAxisCanvas.height)
    })
  }

  createTimeContainer() {
    const el = this.createContainer()

    el.classList.add('chart-layout__time-scale-container')

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
      this.timeAxisCanvas.setSize(rect.width, this.timeAxisCanvas.height)
    })
  }

  createLegendContainer() {
    const el = this.createContainer()
    el.classList.add('chart-layout__legend-wrapper')
    const legend = new Legend(el, this.chart, {})
    el.innerHTML = legend.getTitle()
    return el
  }

  createContainer(): HTMLElement {
    const el = document.createElement('div')
    this.layoutContainer.appendChild(el)
    return el
  }
}
