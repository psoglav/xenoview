import { Canvas, Component } from '../core'

export default class Grid extends Component {
  constructor() {
    super()
  }

  update(canvas: Canvas): void {
    this.drawRows(canvas)
    this.drawColumns(canvas)
  }

  drawRows(canvas: Canvas) {
    let rows = this.chart.getPriceTicks()

    canvas.ctx.beginPath()
    canvas.ctx.strokeStyle = '#7777aa33'

    for (let i of rows) {
      let y = this.chart.normalizeToY(i)
      canvas.moveTo(0, y)
      canvas.lineTo(canvas.width, y)
    }

    canvas.ctx.stroke()
    canvas.ctx.closePath()
  }

  drawColumns(canvas: Canvas) {
    let cols = this.chart.getTimeTicks()

    canvas.ctx.beginPath()
    canvas.ctx.strokeStyle = '#7777aa33'

    for (let i of cols) {
      let x = this.chart.getPointX(i)
      canvas.moveTo(x, 0)
      canvas.lineTo(x, canvas.height)
    }

    canvas.ctx.stroke()
    canvas.ctx.closePath()
  }
}
