import { VElement } from './v-element'
import { Canvas } from '.'

export class Label extends VElement {
  public text: string
  public color: string
  public align: CanvasTextAlign
  public baseline: CanvasTextBaseline

  constructor(
    canvas: HTMLCanvasElement,
    x: number,
    y: number,
    text: string,
    color?: string,
    align?: CanvasTextAlign,
    baseline?: CanvasTextBaseline
  ) {
    super(canvas)
    this.setPosition(x, y)
    this.text = text
    this.color = color
    this.align = align
    this.baseline = baseline
  }

  update(): void {
    this.draw()
  }

  draw(): void {
    this.rect = Canvas.measureText(this.ctx, this.text, this.position.x, this.position.y)

    if (this.color) this.ctx.fillStyle = this.color
    if (this.align) this.ctx.textAlign = this.align
    if (this.baseline) this.ctx.textBaseline = this.baseline

    this.ctx.fillText(this.text, this.position.x, this.position.y)
  }

  destroy(): void {}

  onMouseDown(e: MouseEvent): void {}

  onMouseEnter(e: MouseEvent): void {}

  onMouseLeave(e: MouseEvent): void {}

  onMouseMove(e: MouseEvent): void {}

  onMouseUp(e: MouseEvent): void {}
}
