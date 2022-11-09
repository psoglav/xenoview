import { Component } from '.'

export type CanvasOptions = {
  container: HTMLElement
  components: {
    [name: string]: Component
  }
  updateByRequest?: boolean
  zIndex?: number
}

export class Canvas {
  options: CanvasOptions
  raw: HTMLCanvasElement

  public needsUpdate: boolean = true

  get canvas() {
    return this.raw
  }

  get ctx() {
    return this.canvas.getContext('2d')
  }

  get width() {
    return this.raw.width * this.getPixelRatio(this.ctx)
  }

  get height() {
    return this.raw.height * this.getPixelRatio(this.ctx)
  }

  get components() {
    return this.options.components
  }

  constructor(options: CanvasOptions) {
    this.options = options
    this.create()
  }

  create() {
    this.raw = this.createCanvas()
  }

  private createCanvas() {
    const preventDefault = function (e: Event) {
      e.preventDefault()
      e.stopPropagation()
    }

    let el = document.createElement('canvas')
    let ctx = el.getContext('2d')

    ctx.lineWidth = 1 * this.getPixelRatio(ctx)

    el.oncontextmenu = preventDefault
    el.onwheel = preventDefault

    el.style.width = '100%'
    el.style.height = '100%'
    el.style.position = 'absolute'
    el.style.inset = '0'
    el.style.zIndex = (this.options.zIndex || 0).toString()

    let rect = this.options.container.getBoundingClientRect()
    this.setSize(rect.width, rect.height, el)

    this.options.container.appendChild(el)
    this.rescale(ctx)

    return el
  }

  update() {
    if (!this.options.updateByRequest || this.needsUpdate) {
      this.rescale()
      this.clear()

      Object.entries(this.options.components).forEach(([key, component]) => {
        component.update(this)
      })

      this.needsUpdate = false
    }
  }

  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height)
  }

  fitToParent() {
    const rect = this.raw.parentElement.getBoundingClientRect()
    this.setSize(rect.width, rect.height)
  }

  setSize(w: number, h: number, canvas?: HTMLCanvasElement) {
    if (!canvas) canvas = this.raw
    canvas.width = w
    canvas.height = h
  }

  rescale(ctx?: CanvasRenderingContext2D) {
    let _ctx = ctx || this.ctx
    let pixelRatio = this.getPixelRatio(_ctx)
    let width = _ctx.canvas.clientWidth * pixelRatio
    let height = _ctx.canvas.clientHeight * pixelRatio
    if (width != _ctx.canvas.width) _ctx.canvas.width = width
    if (height != _ctx.canvas.height) _ctx.canvas.height = height
    _ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0)
  }

  getSharpPixel(pos: number, thickness: number = 1): number {
    if (thickness % 2 == 0) {
      return pos
    }
    return pos + this.getPixelRatio(this.ctx) / 2
  }

  getPixelRatio(context: any) {
    let dpr = window.devicePixelRatio || 1
    let bsr =
      context.webkitBackingStorePixelRatio ||
      context.mozBackingStorePixelRatio ||
      context.msBackingStorePixelRatio ||
      context.oBackingStorePixelRatio ||
      context.backingStorePixelRatio ||
      1

    return dpr / bsr
  }

  rect(x: number, y: number, w: number, h: number) {
    this.ctx.rect(
      this.getSharpPixel(Math.round(x) + 0.5),
      this.getSharpPixel(Math.round(y) + 0.5),
      this.getSharpPixel(Math.round(w) + 0.5),
      this.getSharpPixel(Math.round(h) + 0.5)
    )
  }

  circle(x: number, y: number, radius: number) {
    this.ctx.beginPath()
    x = this.getSharpPixel(Math.round(x) + 0.5)
    y = this.getSharpPixel(Math.round(y) + 0.5)
    this.ctx.arc(x, y, radius, 0, 2 * Math.PI, false)
    this.ctx.fill()
    this.ctx.stroke()
    this.ctx.closePath()
  }

  moveTo(x: number, y: number) {
    this.ctx.moveTo(this.getSharpPixel(Math.round(x)), this.getSharpPixel(Math.round(y)))
  }

  lineTo(x: number, y: number) {
    this.ctx.lineTo(this.getSharpPixel(Math.round(x)), this.getSharpPixel(Math.round(y)))
  }
}
