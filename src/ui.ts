export class UI {
  elements: UIElement[]

  constructor(...elements: UIElement[]) {
    this.elements = elements
  }

  draw(clear?: boolean): void {
    if (clear) {
      for (let el of this.elements) {
        el.clearCanvas()
      }
    }
    for (let el of this.elements) {
      el.draw()
    }
  }
}

export abstract class UIElement {
  position: [number, number]
  ctx: CanvasRenderingContext2D

  constructor(x: number, y: number, ctx: CanvasRenderingContext2D) {
    this.position = [x, y]
    this.ctx = ctx
  }

  abstract draw(): void

  clearCanvas(): void {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
  }
}

type UIElementValue = string | [object, string] | Function
type UILabelOptions = {
  value: UIElementValue
  x: number
  y: number
  font: string
  size: number
  color: string
  ctx: CanvasRenderingContext2D
}

export class Label extends UIElement {
  value: UIElementValue
  font: string
  size: number
  color: string

  constructor(opts: UILabelOptions) {
    super(opts.x, opts.y, opts.ctx)
    this.value = opts.value
    this.font = opts.font
    this.size = opts.size
    this.color = opts.color
  }

  get text(): string {
    let result = ''

    if (typeof this.value != 'string') {
      if (typeof this.value == 'object') {
        result = this.value[0][this.value[1]]
      } else if (typeof this.value == 'function') {
        result = this.value()
      }
    } else {
      result = this.value
    }

    return result
  }

  get width(): number {
    this.ctx.fillStyle = this.color
    this.ctx.font = this.size + 'px ' + this.font
    return this.ctx.measureText(this.text).width
  }

  draw(): void {
    this.ctx.fillStyle = this.color
    this.ctx.font = this.size + 'px ' + this.font
    this.ctx.fillText(this.text, this.position[0], this.position[1])
  }
}
