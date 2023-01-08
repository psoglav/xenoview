import Destroyable from '../../models/destroyable'

export abstract class VElement implements Destroyable {
  public isDestroyed: boolean = false
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

  abstract bind(): void

  abstract update(): void
  abstract draw(): void

  abstract onMouseEnter(e: MouseEvent): void
  abstract onMouseMove(e: MouseEvent): void
  abstract onMouseLeave(e: MouseEvent): void
  abstract onMouseDown(e: MouseEvent): void
  abstract onMouseUp(e: MouseEvent): void

  abstract destroy(): void

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
