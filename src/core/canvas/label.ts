import { VElement } from './v-element'
import { Canvas } from '.'

export class Label extends VElement {
  public text: string
  public color: string

  constructor(canvas: HTMLCanvasElement, x: number, y: number, text: string, color?: string) {
    super(canvas)
    this.setPosition(x, y)
    this.text = text
    if (color) this.color = color
  }

  update(): void {
    this.draw()
  }

  draw(): void {
    this.rect = Canvas.measureText(this.ctx, this.text, this.position.x, this.position.y)
    this.ctx.fillStyle = this.color || 'white'
    this.ctx.fillText(this.text, this.position.x, this.position.y)
  }
}
