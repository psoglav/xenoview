import { Canvas, Component, Chart } from '../core'

export const PROMPTS = {
  zooming: 'Hold Ctrl to zoom into the center, and Alt to zoom proportionally'
}

export default class Prompt extends Component {
  value: string

  constructor(chart: Chart) {
    super(chart)
  }

  update(canvas: Canvas) {
    if (!canvas.ctx || !this.value) return
    canvas.ctx.font = '12px Verdana'
    canvas.ctx.textAlign = 'center'
    canvas.ctx.fillStyle = this.chart._opts.textColor + 55
    let y = canvas.height - 20
    for (let line of canvas.getLines(this.value, 400).reverse()) {
      canvas.ctx.fillText(line, canvas.width / 2, y)
      y -= 12 * 1.3
    }
    canvas.ctx.textAlign = 'left'
  }
}
