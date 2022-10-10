import { Chart, Component } from '../core'

import { getFullTimeFromTimestamp, getTimeFromTimestamp } from '../../utils'

export default class TimeAxis extends Component {
  public canvas: HTMLCanvasElement
  public get ctx() {
    return this.canvas.getContext('2d')
  }

  public isZooming: boolean = false

  constructor(chart: Chart) {
    super(chart)
    this.createCanvas()
    this.bindEventListeners()
  }

  bindEventListeners() {
    this.canvas.addEventListener('mousedown', (e) => (this.isZooming = true))
    this.canvas.addEventListener('mouseup', (e) => (this.isZooming = false))
    window.addEventListener('mouseup', (e) => (this.isZooming = false))
    window.addEventListener('resize', () => {
      let rect = this.chart.container!.getBoundingClientRect()
      this.chart.setSize(rect.width - 70, 28, this.canvas)
    })
  }

  createCanvas() {
    this.canvas = document.createElement('canvas')
    this.canvas.style.gridArea = '2 / 1 / 3 / 3'
    this.canvas.style.width = 'calc(100% - 70px)'
    this.canvas.style.height = '28px'
    this.canvas.style.cursor = 'e-resize'
  }

  drawLabels() {
    let cols = this.chart.getGridColumns()

    this.chart.clear(this.ctx)
    this.ctx.beginPath()
    let size = this.chart.options.timeAxis?.labels?.fontSize || 11
    this.ctx.fillStyle = this.chart.options.textColor
    this.ctx.font = size + 'px Verdana'

    for (let i of cols) {
      let point = this.chart.history[i]
      let x = this.chart.getPointX(i)
      let time = getTimeFromTimestamp(point.time * 1000)

      this.ctx.fillText(time, x - 16, 16)
    }

    this.ctx.stroke()
    this.ctx.closePath()
  }

  drawTimeMarker() {
    let data = this.chart.history
    if (!data) return
    let h = this.chart.getHeight(this.ctx)
    let x = this.chart.mousePosition.x - this.chart.canvasRect.x
    let i = Math.round(
      ((x - this.chart.boundingRect.left) / this.chart.chartFullWidth) *
        data.length,
    )
    let point = data[i]
    if (!point) return

    if (point.time.toString().length != 13) point.time *= 1000
    let time = getFullTimeFromTimestamp(point.time)

    x = this.chart.getPointX(i)
    this.ctx.beginPath()
    this.ctx.fillStyle = this.chart.options.pointer.bgColor
    this.chart.rect(x - 60, 0, 118, h, this.ctx)
    this.ctx.fill()
    this.ctx.closePath()
    this.ctx.fillStyle = 'white'
    this.ctx.font = '11px Verdana'
    this.ctx.fillText(time, x - 50, 20)
  }

  zoom(dx: number) {
    if (this.isZooming) {
      this.chart.transform.zoom(dx / -100, 0)
      this.chart.draw()
    }
  }

  update() {
    this.drawLabels()

    if (this.chart.pointer.isVisible) {
      this.drawTimeMarker()
    }
  }
}
