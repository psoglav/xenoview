import { Component } from '.'

export type CanvasOptions = {
  container: HTMLElement
  zIndex: number
  panning?: boolean
  components: {
    [name: string]: Component
  }
}

export class Canvas {
  options: CanvasOptions
  raw: HTMLCanvasElement

  global = {
    scale: 1,
    offset: {
      x: 0,
      y: 0
    }
  }

  pan = {
    enabled: false,
    start: {
      x: 0,
      y: 0
    },
    offset: {
      x: 0,
      y: 0
    }
  }

  get canvas() {
    return this.raw
  }

  get ctx() {
    return this.canvas.getContext('2d')
  }

  get width() {
    return this.raw.width
  }

  get height() {
    return this.raw.height
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
    el.style.zIndex = this.options.zIndex.toString()

    let rect = this.options.container.getBoundingClientRect()
    this.setSize(rect.width, rect.height, el)

    this.options.container.appendChild(el)
    this.rescale(ctx)

    return el
  }

  update() {
    this.rescale()
    this.clear()

    Object.values(this.options.components).forEach(component => {
      component.update(this)
    })
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
}
