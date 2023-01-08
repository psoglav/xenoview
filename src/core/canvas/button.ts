import { InteractiveVElement, Canvas, Label } from '.'

export interface ButtonOptions {
  text: string
  padding?: {
    x: number
    y: number
  }
  border?: {
    width: number
    color: string
  }
  textColor: {
    default: string
    hover?: string
    active?: string
  }
  fillColor: {
    default: string
    hover?: string
    active?: string
  }
}

export class Button extends InteractiveVElement {
  private options: ButtonOptions
  private label: Label

  constructor(canvas: HTMLCanvasElement, x: number, y: number, options: ButtonOptions) {
    super(canvas)
    this.options = options
    this.setPosition(x, y)
    this.label = new Label(canvas, x, y, options.text)
  }

  update(): void {
    this.draw()
  }

  draw(): void {
    const { x, y, width, height } = this.rect

    if (this.options.border) {
      this.ctx.lineWidth = this.options.border.width
      this.ctx.strokeStyle = this.options.border.color
      this.ctx.strokeRect(x, y, width, height)
    }

    this.rect = this.applyPadding(Canvas.measureText(this.ctx, this.options.text, this.position.x, this.position.y))

    this.ctx.fillStyle = this.options.fillColor[this.state]

    this.ctx.fillRect(x, y, width, height)

    this.label.color = this.options.textColor[this.state]

    this.label.update()
  }

  applyPadding(rect: Rect) {
    if (!this.options.padding) return rect
    const { x: px, y: py } = this.options.padding
    rect.x -= px
    rect.y -= py
    rect.width += px * 2
    rect.height += py * 2
    return rect
  }

  onMouseDown(e: MouseEvent): void {}

  onMouseUp(e: MouseEvent): void {}

  onMouseEnter(e: MouseEvent): void {}

  onMouseMove(e: MouseEvent): void {}

  onMouseLeave(e: MouseEvent): void {}
}
