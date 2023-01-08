import { Canvas } from '.'

export abstract class Component {
  get chart() {
    return window.xenoview
  }
  abstract update(canvas: Canvas): void
}
