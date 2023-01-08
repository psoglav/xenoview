import Destroyable from '../../models/destroyable'
import { VElement } from './v-element'

type MouseCursorState = 'hover' | 'active' | 'default'

export abstract class InteractiveVElement extends VElement implements Destroyable {
  public mouse: Position

  private get chart() {
    return window.xenoview
  }

  private _state: MouseCursorState = 'default'

  public get state() {
    return this._state
  }

  public set state(value: MouseCursorState) {
    switch (value) {
      case 'default':
        this.chart.mouse.cursor = this.chart.mouse.DEFAULT_CURSOR
        this.chart.mouse.isBlockedByUI = false
        break
      case 'active':
        this.chart.mouse.cursor = 'pointer'
        this.chart.mouse.isBlockedByUI = true
        break
      case 'hover':
        this.chart.mouse.cursor = 'pointer'
        this.chart.mouse.isBlockedByUI = true
        break
    }
    this._state = value
  }

  public get isHovered() {
    return this.state === 'hover'
  }

  public get isClicked() {
    return this.state === 'active'
  }

  constructor(canvas: HTMLCanvasElement) {
    super(canvas)
    this.bind()
  }

  abstract onMouseEnter(e: MouseEvent): void
  abstract onMouseMove(e: MouseEvent): void
  abstract onMouseLeave(e: MouseEvent): void
  abstract onMouseDown(e: MouseEvent): void
  abstract onMouseUp(e: MouseEvent): void

  bind(): void {
    this.canvas.addEventListener('mousemove', this._onMouseMove.bind(this))
    this.canvas.addEventListener('mousedown', this._onMouseDown.bind(this))
    this.canvas.addEventListener('mouseup', this._onMouseUp.bind(this))
  }

  private _onMouseMove(e: MouseEvent) {
    this.mouse = { x: e.clientX - this.canvasRect.x, y: e.clientY - this.canvasRect.y }

    if (this.isInside(this.mouse)) {
      if (!this.isHovered && !this.isClicked) {
        this.onMouseEnter(e)
        this.state = 'hover'
      }
      this.onMouseMove(e)
    } else if (this.isHovered) {
      this.onMouseLeave(e)
      this.state = 'default'
    }
  }

  private _onMouseDown(e: MouseEvent) {
    if (this.isInside(this.mouse)) {
      this.onMouseDown(e)
      this.state = 'active'
    }
  }

  private _onMouseUp(e: MouseEvent) {
    if (this.isInside(this.mouse)) {
      this.onMouseUp(e)
      this.state = 'hover'
    } else {
      this.state = 'default'
    }
  }

  destroy() {
    this.canvas.removeEventListener('mousemove', this._onMouseMove.bind(this))
    this.canvas.removeEventListener('mousedown', this._onMouseDown.bind(this))
    this.canvas.removeEventListener('mouseup', this._onMouseUp.bind(this))
  }
}
