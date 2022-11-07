import {
  symbolToCurrency,
  getIntervalByDateRange,
  getIntervalWeight
} from '../utils'
import { TimeInterval, DateRange } from '../types/time'
import moment from 'moment'

type CurrentBarState = {
  PRICE: number
  LASTUPDATE: number
  open: number
  high: number
  low: number
  close: number
}
export type ListenerFunction = (state: CurrentBarState) => void

export class Ticker {
  public state: CurrentBarState

  private symbol: string
  private interval: TimeInterval
  private range: DateRange = '5d'

  private ws: WebSocket = null
  private listeners: ListenerFunction[] = []

  constructor(symbol: string, interval: TimeInterval) {
    this.symbol = symbol
    this.interval = interval

    this.init()
  }

  get currency() {
    return symbolToCurrency(this.symbol)
  }

  setSymbol(value) {
    this.symbol = value
    this.init()
  }

  setInterval(value: TimeInterval) {
    this.interval = value
    this.init()
  }

  setRange(value: DateRange) {
    this.range = value
    this.interval = getIntervalByDateRange(value)
  }

  get historyRange(): [number, number] {
    let veryBeginning = moment([2009, 0, 3]).unix()
    let end = +new Date()
    let start = Math.max(
      end - getIntervalWeight(this.interval) * 1000,
      veryBeginning
    )
    return [start, end]
  }

  async fetchHistory(): Promise<History.Data> {
    let params: any = {
      symbol: this.symbol + 'USDT',
      interval: this.interval,
      startTime: this.historyRange[0],
      endTime: this.historyRange[1],
      limit: 1000
    }

    let response = await fetch(
      `https://api.binance.com/api/v3/klines?${Object.entries(params)
        .map(([k, v]) => k + '=' + v)
        .join('&')}`,
      {
        method: 'GET'
      }
    )

    let data = (await response.json()).map(
      ([time, open, high, low, close, volume]) => ({
        time,
        open: +open,
        high: +high,
        low: +low,
        close: +close,
        volume: +volume
      })
    )

    return data
  }

  init() {
    this.ws?.close()
    this.state = null
    this.subscribe()
  }

  subscribe() {
    this.ws = new WebSocket(
      `wss://stream.binance.com:9443/ws/${this.symbol.toLowerCase()}usdt@kline_${
        this.interval
      }`
    )

    this.ws.onmessage = (event: any) => {
      let data = JSON.parse(event.data)
      if (data.s?.startsWith(this.symbol)) {
        this.state = {
          PRICE: +data.k.c,
          LASTUPDATE: Math.floor(data.k.t / 1000),
          open: +data.k.o,
          high: +data.k.h,
          low: +data.k.l,
          close: +data.k.c
        }
        this.listeners.forEach(cb => cb(this.state))
      }
    }

    this.ws.onclose = () => {
      setTimeout(this.subscribe.bind(this), 1000)
    }
  }

  addListener(cb: ListenerFunction) {
    this.listeners.push(cb)
  }
}
