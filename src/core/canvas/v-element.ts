export abstract class VElement {
  public position: Position
  public rect: Rect = { x: 0, y: 0, width: 0, height: 0 }
  public canvas: HTMLCanvasElement

  get ctx() {
    return this.canvas.getContext('2d')!
  }

  get canvasRect() {
    return this.canvas.getBoundingClientRect()
  }

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas
  }

  abstract update(): void
  abstract draw(): void

  setPosition(x: number, y: number) {
    this.position = { x, y }
  }

  isInside(pos: Position) {
    return (
      pos.x > this.rect.x &&
      pos.x < this.rect.x + this.rect.width &&
      pos.y < this.rect.y + this.rect.height &&
      pos.y > this.rect.y
    )
  }
}
