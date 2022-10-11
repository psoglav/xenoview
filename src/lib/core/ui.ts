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
  position: UI.Position
  ctx: CanvasRenderingContext2D

  constructor(opts: UI.ElementOptions) {
    this.position = { x: opts.x, y: opts.y }
    this.ctx = opts.ctx
  }

  abstract draw(): void
  abstract width: number

  clearCanvas(): void {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)
  }
}

export class UIElementGroup extends UIElement {
  position: UI.Position
  elements: (UIElement | number)[]
  gap: number

  constructor(opts: UI.ElementGroupOptions) {
    super({ x: opts.x, y: opts.y, ctx: opts.ctx })
    this.position = { x: opts.x, y: opts.y }
    this.elements = opts.elements
    this.gap = opts.gap
  }

  get width(): number {
    let result = 0
    this.elements.forEach(el => {
      if(typeof el == 'number') result += el
      else result += el.width + this.gap
    })
    return result
  }

  draw(): void {
    let xcur = this.position.x
    this.elements.forEach(el => {
      if (typeof el == 'number') {
        xcur += el
        return
      }
      el.position.x = xcur
      el.draw()
      xcur += el.width + this.gap
    })
  }
}

export class Label extends UIElement {
  value: any
  font: string
  size: number
  color: string | Function

  constructor(opts: UI.LabelOptions) {
    super({ x: opts.x, y: opts.y, ctx: opts.ctx })
    this.value = opts.value
    this.font = opts.font
    this.size = opts.size
    this.color = opts.color
  }

  get text(): string {
    let result = this.value

    if (typeof this.value == 'object') {
      result = this.value[0][this.value[1]]
    } else if (typeof this.value == 'function') {
      result = this.value()
    }

    return result.toString()
  }

  setStyle() {
    this.ctx.fillStyle = typeof this.color == 'function' ? this.color() : this.color
    this.ctx.font = this.size + 'px ' + this.font
  }

  get width(): number {
    this.setStyle()
    return this.ctx.measureText(this.text).width
  }

  draw(): void {
    this.setStyle()
    this.ctx.fillText(this.text, this.position.x, this.position.y)
  }
}
