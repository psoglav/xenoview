import { symbolToCurrency } from '../utils/crypto'

type HistoryInterval = 'day' | 'hour' | 'minute'

export class Ticker {
  public state:
    | {
        PRICE: number
        LASTUPDATE: number
        open: number
        high: number
        low: number
        close: number
      }
    | undefined

  public sym: string

  private ws: WebSocket = null
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
  ): Promise<HistoryData> {
    let params = {
      // limit: 1000,
      fsym: symbol,
      tsym: 'USD',
      tryConversion: false,
    }

    let q = Object.entries(params)
      .map(([k, v]) => k + '=' + v)
      .join('&')

    let response = await fetch(
      `https://min-api.cryptocompare.com/data/v2/histo${interval}?${q}`,
      {
        method: 'GET',
        headers: {
          Authorization: 'Apikey ' + this.apiKey,
        },
      },
    )

    return (await response.json()).Data.Data
  }

  init() {
    this.ws?.close()
    this.state = null
    this.initBinance(this.sym)
  }

  initBinance(symbol: string) {
    this.ws = new WebSocket(
      `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}usdt@kline_1m`,
    )
    this.ws.onmessage = (event: any) => {
      let data = JSON.parse(event.data)
      console.log(data.s, this.sym)
      if (data.s?.startsWith(this.sym)) {
        this.state = {
          PRICE: +data.k.c,
          LASTUPDATE: Math.floor(data.k.t / 1000),
          open: +data.k.o,
          high: +data.k.h,
          low: +data.k.l,
          close: +data.k.c,
        }
      }
    }
  }

  initCryptoCompare(symbol: string) {
    this.ws = new WebSocket(
      'wss://streamer.cryptocompare.com/v2?api_key=' + this.apiKey,
    )
    this.ws.onopen = () => {
      let subRequest = {
        action: 'SubAdd',
        subs: [`2~Coinbase~${symbol}~USD`],
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
}
