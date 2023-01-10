import Destroyable from '../../models/destroyable'

export abstract class VElement implements Destroyable {
  _id: number
  private _position: Vector = { x: 0, y: 0 }

  public isDestroyed: boolean = false
  public origin: Vector = { x: 0, y: 0 }
  public _padding: Vector = { x: 0, y: 0 }
  public _rect: Rect = { x: 0, y: 0, width: 0, height: 0 }
  public canvas: HTMLCanvasElement

  public get position(): Vector {
    return {
      x: this._position.x,
      y: this._position.y
    }
  }

  public get rect(): Rect {
    const { x: px, y: py } = this._padding
    const rect = { ...this._rect }
    rect.x -= px
    rect.y -= py
    rect.width += px * 2
    rect.height += py * 2
    return rect
  }

  public set rect(value: Rect) {
    this._rect = value
  }

  get chart() {
    return window.xenoview
  }

  get ctx() {
    return this.canvas.getContext('2d')!
  }

  get canvasRect() {
    return this.canvas.getBoundingClientRect()
  }

  constructor(canvas: HTMLCanvasElement) {
    this._id = +new Date()
    this.canvas = canvas
  }

  abstract update(): void
  abstract draw(): void

  abstract onMouseEnter(e: MouseEvent): void
  abstract onMouseMove(e: MouseEvent): void
  abstract onMouseLeave(e: MouseEvent): void
  abstract onMouseDown(e: MouseEvent): void
  abstract onMouseUp(e: MouseEvent): void

  abstract destroy(): void

  setPosition(x: number, y: number) {
    this._position = { x, y }
  }

  setOrigin(x: number, y: number) {
    this.origin = { x, y }
  }

  setPadding(x: number, y: number) {
    this._padding = { x, y }
  }

  isInside(pos: Vector) {
    return (
      pos.x > this.rect.x &&
      pos.x < this.rect.x + this.rect.width &&
      pos.y < this.rect.y + this.rect.height &&
      pos.y > this.rect.y
    )
  }
}
