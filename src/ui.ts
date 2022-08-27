export default class UI {
  ctx: CanvasRenderingContext2D

  constructor(ctx: CanvasRenderingContext2D) {
    this.changeContext(ctx)
  }

  changeContext(ctx: CanvasRenderingContext2D) {
    this.ctx = ctx
  }

  label(text: string, x: number, y: number, size: number) {
    this.ctx.fillStyle = 'white'
    this.ctx.font = size + 'px Arial'
    this.ctx.fillText(text, x, y)
  }
}
