import { Component, EventEmitter, Position,  } from '../../core'
import moment from 'moment'

export default class Trading extends Component {
  public orders: OrderModel[] = []
  public get positions() {
    return this.orders?.filter(el => el.status == 'working')
  }
  public get currentPrice(): number {
    return this.chart.dataProvider.state.PRICE
  }

  private elements: Position[] = []

  constructor() {
    super()
  }

  update() {
    this.positions.forEach(item => {
      const { side, type, price } = item

      if (this.currentPrice > price && ((side == 'sell' && type == 'limit') || (side == 'buy' && type == 'stop'))) {
        this.executeOrder(item)
      }

      if (price > this.currentPrice && ((side == 'buy' && type == 'limit') || (side == 'sell' && type == 'stop'))) {
        this.executeOrder(item)
      }

      if (item.type === 'market') {
        item.price = this.currentPrice
        this.executeOrder(item)
      }
    })
    this.elements = this.elements.filter(el => !el.isDestroyed)
    this.elements.forEach(element => {
      if (element.options.price) element.update()
    })
  }

  public updateOrder(id: string, payload: Partial<OrderModel>) {
    const i = this.orders.findIndex((item: OrderModel) => item.id === id)
    Object.keys(key => {
      if (key in this.orders[i]) {
        this.orders[i][key] = payload[key]
      }
    })
  }

  public updateOrders(items: OrderModel[]) {
    this.orders = items
    this.orders.forEach(item => {
      if (!item.id) {
        item.id = this.orders.length.toString(16)
        item.deltaPrice = 0
        item.status = 'working'
        item.at = moment().format('DD.MM.YY HH:mm:ss')
      }
      this.openPosition(item)
    })
  }

  public executeOrder(order: OrderModel) {
    this.closePosition(order, 'fulfilled')
    EventEmitter.dispatch('trading:order-fulfilled', order)
  }

  public openPosition(order: OrderModel) {
    if (this.elements.findIndex(el => el.options.id === order.id) != -1) return
    const position = new Position(this.chart.uiLayer.canvas, order)
    this.elements.push(position)
  }

  public closePosition(value: OrderModel | string, status: Exclude<OrderStatus, 'working'> = 'canceled') {
    const id = typeof value === 'string' ? value : value.id
    const i = this.orders.findIndex(el => el.id === id)
    this.orders[i].status = status
    this.elements.forEach((el: any) => {
      if (el.options?.id === id) {
        el.destroy()
      }
    })
  }
}
