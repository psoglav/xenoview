import { capitalize } from '../../utils'
import { Canvas, Chart, Component } from '../../core'
import { MarkModel } from '../../models/mark'
import Color from 'color'

type OrderType = 'market' | 'limit' | 'stop'
type OrderSide = 'buy' | 'sell'
type OrderSymbol = 'BTCUSDT' | 'ETHUSDT' | 'LTCUSDT'

export type Order = {
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

export default class Trading extends Component {
  public orders: Order[] = []

  constructor() {
    super()
  }

  update(canvas: Canvas) {
    const atLeastOneIsHovered = () => this.orders.findIndex(item => item.isHovered) != -1
    const atLeastOneIsGrabbed = () => this.orders.findIndex(item => item.isGrabbed) != -1

    if (!this.orders?.length) return

    this.orders.forEach(item => {
      if (item.isGrabbed) {
        item.deltaPrice = this.chart.normalizeToPrice(canvas.mouse.y) - item.price
      }

      const color = new Color(this.chart.options.candles.colors[item.side === 'buy' ? 'higher' : 'lower'])
      const bg = new Color(item.isHovered ? this.chart.options.bgColor : '#111111')

      const y = this.chart.normalizeToY(item.deltaPrice + item.price)
      const width = canvas.width

      const mark: MarkModel = {
        type: item.isGrabbed ? 'primary' : 'secondary',
        x: width - 200,
        y,
        text: `${item.units} | ${capitalize(item.side)} ${capitalize(item.type)}`,
        color: color.alpha(item.isModified ? 0.5 : 1),
        bg: bg.alpha(item.isModified ? 0.5 : 1),
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
    item.id = this.orders.length.toString(16)

    Object.defineProperty(item, 'isModified', {
      get() {
        return !!this.deltaPrice && !this.isGrabbed
      }
    })

    this.orders.push(item)
  }

  public updateOrder(id: string, payload: Partial<Order>) {
    const i = this.orders.findIndex((item: Order) => item.id === id)
    Object.keys(key => {
      if (key in this.orders[i]) {
        this.orders[i][key] = payload[key]
      }
    })
  }

  public updateOrders(items: Order[]) {
    this.orders = []
    items.forEach(item => {
      this.createOrder(item)
    })
  }

  public removeOrder(value: Order | string) {
    this.orders = this.orders.filter(el => el.id !== (typeof value === 'string' ? value : value.id))
  }
}
