import Configurable from '@/models/configurable'
import moment from 'moment'

import { DataProviderOptions, defaultDataProviderOptions } from '../config/data-provider-options'
import { getIntervalByDateRange, symbolToCurrency } from '../utils'
import BinanceAPIClient from './binance-api-client'

type CurrentBarState = {
  PRICE: number
  LASTUPDATE: number
  open: number
  high: number
  low: number
  close: number
}

export type ListenerFunction = (state: CurrentBarState) => void

export class DataProvider implements Configurable<DataProviderOptions> {
  _opts: DataProviderOptions = defaultDataProviderOptions

  public state: CurrentBarState

  private _client = new BinanceAPIClient()
  private readonly listeners: ListenerFunction[] = []

  get api() {
    return this._client
  }

  get symbol() {
    return this._opts.fromSymbol + this._opts.toSymbol
  }

  get currency() {
    return symbolToCurrency(this._opts.fromSymbol)
  }

  get historyRange(): [number, number] {
    let veryBeginning = moment([2009, 0, 3]).unix()
    let end = +new Date()
    let start = Math.max(end - IntervalWeights[this._opts.interval] * 1000, veryBeginning)
    return [start, end]
  }

  constructor(opts: DataProviderOptions) {
    this.applyOptions(opts)
    this.init()
  }

  applyOptions(opts: DataProviderOptions): void {
    Object.keys(opts).forEach(option => {
      this._opts[option] = opts[option]
    })
  }

  async requestHistory(): Promise<History.Data> {
    return await this.api.getKLines({
      symbol: this.symbol,
      interval: this._opts.interval,
      startTime: this.historyRange[0],
      endTime: this.historyRange[1],
      limit: 1000
    })
  }

  init() {
    this.state = null

    this.api.disconnect()
    this.api.connect(async () => {
      this.api.subscribe(this.symbol, `kline_${this._opts.interval}`)
      this.api.onStreamEvent('kline', (data: any) => {
        if (data.s === this.symbol)
          this.state = {
            PRICE: +data.k.c,
            LASTUPDATE: Math.floor(data.k.t / 1000),
            open: +data.k.o,
            high: +data.k.h,
            low: +data.k.l,
            close: +data.k.c
          }
        this.listeners.forEach(cb => cb(this.state))
      })
    })
  }

  public addListener(cb: ListenerFunction) {
    this.listeners.push(cb)
  }

  public setFromSymbol(value) {
    this.applyOptions({ fromSymbol: value })
    this.init()
  }

  public setToSymbol(value) {
    this.applyOptions({ toSymbol: value })
    this.init()
  }

  public setInterval(value: Interval) {
    this.applyOptions({ interval: value })
    this.init()
  }

  public setRange(value: DateRange) {
    this.applyOptions({
      range: value,
      interval: getIntervalByDateRange(value)
    })
  }
}
