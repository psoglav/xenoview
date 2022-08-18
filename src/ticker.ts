import { HistoryData } from "./types";

type HistoryInterval = 'day' | 'hour' | 'minute'

export class Ticker {
  public state: { PRICE: number; LASTUPDATE: number } = null

  private apiKey = ''

  constructor(symbol: string) {
    this.initBinance(symbol)
  }

  async fetchHistory(symbol: string, interval: HistoryInterval): Promise<HistoryData> {
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

  initBinance(symbol: string) {
    const ws = new WebSocket(
      `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}usdt@kline_1m`,
    )
    ws.onmessage = (event: any) => {
      let data = JSON.parse(event.data)
      if (!this.state) {
        this.state = {
          PRICE: +data.k.c,
          LASTUPDATE: Math.floor(data.k.t / 1000),
        }
      } else {
        this.state.PRICE = +data.k.c
        this.state.LASTUPDATE = Math.floor(data.k.t / 1000)
      }
    }
  }

  initCryptoCompare(symbol: string) {
    const ws = new WebSocket(
      'wss://streamer.cryptocompare.com/v2?api_key=' + this.apiKey,
    )
    ws.onopen = () => {
      let subRequest = {
        action: 'SubAdd',
        subs: [`2~Coinbase~${symbol}~USD`],
      }
      ws.send(JSON.stringify(subRequest))
    }

    ws.onmessage = (event: any) => {
      let data = JSON.parse(event.data)
      if (data.TYPE == 2) {
        this.state = data
      }
    }
  }
}
