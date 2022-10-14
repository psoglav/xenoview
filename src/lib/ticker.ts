import { symbolToCurrency } from '../utils'

type HistoryInterval = 'day' | 'hour' | 'minute'

export class Ticker {
  public state: Ticker.State

  public sym: string

  private ws: WebSocket = null
  private listeners: Ticker.Listener[] = []
  private apiKey = ''

  constructor(symbol: string, apiKey?: string) {
    this.sym = symbol
    this.apiKey = apiKey

    this.init()
  }

  get currency() {
    return symbolToCurrency(this.sym)
  }

  get symbol() {
    return this.sym
  }

  set symbol(value) {
    this.sym = value
    this.init()
  }

  async fetchHistory(
    symbol: string,
    interval: HistoryInterval,
    limit?: number
  ): Promise<History.Data> {
    let params: any = {
      fsym: symbol,
      tsym: 'USD',
      tryConversion: false
    }

    if (limit) params.limit = limit

    let q = Object.entries(params)
      .map(([k, v]) => k + '=' + v)
      .join('&')

    let response = await fetch(
      `https://min-api.cryptocompare.com/data/v2/histo${interval}?${q}`,
      {
        method: 'GET',
        headers: {
          Authorization: 'Apikey ' + this.apiKey
        }
      }
    )

    return (await response.json()).Data.Data
  }

  init() {
    this.ws?.close()
    this.state = null
    this.initBinance()
  }

  initBinance() {
    this.ws = new WebSocket(
      `wss://stream.binance.com:9443/ws/${this.sym.toLowerCase()}usdt@kline_1m`
    )
    this.ws.onmessage = (event: any) => {
      let data = JSON.parse(event.data)
      if (data.s?.startsWith(this.sym)) {
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
      setTimeout(this.initBinance, 1000)
    }
  }

  initCryptoCompare(symbol: string) {
    this.ws = new WebSocket(
      'wss://streamer.cryptocompare.com/v2?api_key=' + this.apiKey
    )
    this.ws.onopen = () => {
      let subRequest = {
        action: 'SubAdd',
        subs: [`2~Coinbase~${symbol}~USD`]
      }
      this.ws.send(JSON.stringify(subRequest))
    }

    this.ws.onmessage = (event: any) => {
      let data = JSON.parse(event.data)
      if (data.TYPE == 2) {
        this.state = data
      }
    }
  }

  addListener(cb: Ticker.Listener) {
    this.listeners.push(cb)
  }
}
