export interface MarksRendererData {
  items: string[]
  align: 'vertical' | 'horizontal'
}

export default class MarksRenderer {
  private _items: string[]

  constructor(data: MarksRendererData) {
    this._items = data.items
  }

  draw(ctx: CanvasRenderingContext2D) {}

  drawMark(ctx: CanvasRenderingContext2D) {}
}
