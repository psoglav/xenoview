import Color from 'color'
import { Canvas, Component } from '../../components'
import { MarkModel } from '../../models/mark'
import { capitalize } from '../../utils'

type OrderType = 'market' | 'limit' | 'stop'
type OrderSide = 'buy' | 'sell'
type OrderSymbol = 'BTCUSDT' | 'ETHUSDT' | 'LTCUSDT'

export type OrderModel = {
  id: string
  type: OrderType
  side: OrderSide
  symbol: OrderSymbol
  price: number
  units: number
  deltaPrice?: number
  isHovered?: boolean
  isGrabbed?: boolean
  isModified?: boolean
}

export default class Order extends Component {
  public options: OrderModel
  public rect: Rect

  constructor(options: OrderModel) {
    super()
    this.options = options
  }

  update(canvas: Canvas) {
    this.draw()
  }

  draw() {
    const opts = this.options

    if (opts.isGrabbed) {
      opts.deltaPrice = this.chart.normalizeToPrice(canvas.mouse.y) - opts.price
    }

    const color = new Color(this.chart.options.candles.colors[opts.side === 'buy' ? 'higher' : 'lower'])
    const bg = new Color(opts.isHovered ? this.chart.options.bgColor : '#111111')

    const y = this.chart.normalizeToY(opts.deltaPrice + opts.price)
    const width = canvas.width

    const mark: MarkModel = {
      type: opts.isGrabbed ? 'primary' : 'secondary',
      x: width - 200,
      y,
      text: `${opts.units} | ${capitalize(opts.side)} ${capitalize(opts.type)}`,
      color: color.alpha(opts.isModified ? 0.5 : 1),
      bg: bg.alpha(opts.isModified ? 0.5 : 1),
      line: 'solid'
    }

    this.rect = canvas.drawMark(mark)

    opts.isHovered = Canvas.isInside(canvas.mouse, rect)

    if (!atLeastOneIsGrabbed() && opts.isHovered) {
      opts.isGrabbed = canvas.mouse.button === 0
    } else if (canvas.mouse.button !== 0) {
      opts.isGrabbed = false
    }
  }
}
