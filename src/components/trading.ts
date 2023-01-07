import { capitalize } from '../utils'
import { Canvas, Chart, Component } from '../core'
import { MarkModel } from '../models/mark'

type OrderType = 'market' | 'limit' | 'stop'
type OrderSide = 'buy' | 'sell'
type OrderSymbol = 'BTCUSDT' | 'ETHUSDT' | 'LTCUSDT'

export type Order = {
  type: OrderType
  side: OrderSide
  symbol: OrderSymbol
  price: number
  units: number
  deltaPrice?: number
  isHovered?: boolean
  isGrabbed?: boolean
}

export default class Trading extends Component {
  public orders: Order[] = []

  constructor(chart: Chart) {
    super(chart)
  }

  update(canvas: Canvas) {
    const atLeastOneIsHovered = () => this.orders.findIndex(item => item.isHovered) != -1
    const atLeastOneIsGrabbed = () => this.orders.findIndex(item => item.isGrabbed) != -1

    this.orders.forEach(item => {
      if (item.isGrabbed) {
        item.deltaPrice = this.chart.normalizeToPrice(canvas.mouse.y) - item.price
      }

      const color = this.chart.options.candles.colors[item.side === 'buy' ? 'higher' : 'lower']
      const y = this.chart.normalizeToY(item.deltaPrice + item.price)
      const width = canvas.width

      const mark: MarkModel = {
        type: item.isGrabbed ? 'primary' : 'secondary',
        x: width - 200,
        y,
        text: `${item.units} | ${capitalize(item.side)} ${capitalize(item.type)}`,
        color,
        bg: item.isHovered ? this.chart.options.bgColor : '#111',
        line: 'solid'
      }

      const rect = canvas.drawMark(mark)

      item.isHovered = Canvas.isInside(canvas.mouse, rect)

      if (!atLeastOneIsGrabbed() && item.isHovered) {
        item.isGrabbed = canvas.mouse.button === 0
      } else if (canvas.mouse.button !== 0) {
        item.isGrabbed = false
      }
    })

    const blocked = atLeastOneIsGrabbed() || atLeastOneIsHovered()

    this.chart.pointer.isBlockedByGUI = blocked
    this.chart.transform.isBlockedByGUI = blocked

    document.body.style.cursor = blocked ? 'pointer' : ''
  }

  public createOrder(item: Order) {
    item.deltaPrice = 0
    this.orders.push(item)
  }

  public updateOrders(items: Order[]) {
    this.orders = items
  }
}
