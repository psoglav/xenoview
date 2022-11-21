export type KLinesParameters = {
  symbol: string
  interval: Interval
  startTime?: number
  endTime?: number
  limit?: number
}

export type DepthParameters = {
  symbol: string
  limit?: number
}

type BinanceStreamMethod = 'SUBSCRIBE' | 'UNSUBSCRIBE' | 'LIST_SUBSCRIPTIONS' | 'SET_PROPERTY' | 'GET_PROPERTY'
type BinanceStreamEventType =
  | 'kline'
  | 'trade'
  | 'aggTrade'
  | '24hrTicker'
  | '24hrMiniTicker'
  | 'depthUpdate'
  | '1hTicker'
type WSEventType = 'close' | 'error' | 'open' | 'message'

export default class BinanceAPIClient {
  private _baseURL = 'https://api.binance.com/api/v3'
  private _wssStreamURL = 'wss://stream.binance.com:9443'
  private _ws: WebSocket = null
  private _counter = 0

  get connected() {
    return this._ws && this._ws.readyState === this._ws.OPEN
  }

  constructor() {}

  private async get(endpoint: string, params: object) {
    return await fetch(
      this._baseURL +
        endpoint +
        `?${Object.entries(params)
          .map(([k, v]) => k + '=' + v)
          .join('&')}`,
      {
        method: 'GET'
      }
    )
  }

  async getKLines(params: KLinesParameters): Promise<History.Data> {
    const response = await this.get('/klines', params)
    return (await response.json()).map(([time, open, high, low, close, volume]) => ({
      time,
      open: +open,
      high: +high,
      low: +low,
      close: +close,
      volume: +volume
    }))
  }

  async getDepth(symbol: string, limit?: number) {
    const response = await this.get('/depth', { symbol, limit })
    return await response.json()
  }

  public connect(onopen?: EventListener, onerror?: EventListener) {
    this._ws = new WebSocket(`${this._wssStreamURL}/ws`)
    if (onopen) this._ws.addEventListener('open', onopen)
    if (onerror) this._ws.addEventListener('error', onerror)
  }

  public on(event: WSEventType, cb: EventListener) {
    if (!this.connected) throw new Error('WebSocket is closed or undefined')
    this._ws.addEventListener(event, (e: any) => cb(JSON.parse(e.data)))
  }

  public onStreamEvent(eventType: BinanceStreamEventType, cb: EventListener) {
    this.on('message', (data: any) => {
      if (data.e == eventType) {
        cb(data)
      }
    })
  }

  public disconnect() {
    this._ws?.close()
  }

  private emit(method: BinanceStreamMethod, params: string[]) {
    const id = +new Date() + this._counter++
    this._ws.send(
      JSON.stringify({
        method,
        params,
        id
      })
    )
    return new Promise((resolve, reject) => {
      this.on('message', (data: any) => {
        if (data.id === id) {
          resolve(data.result)
        } else if (data.error) {
          reject()
        }
      })
    })
  }

  subscribe(symbol: string, streamName: string) {
    return this.emit('SUBSCRIBE', [`${symbol.toLowerCase()}@${streamName}`])
  }

  unsubscribe(symbol: string, streamName: string) {
    return this.emit('UNSUBSCRIBE', [`${symbol.toLowerCase()}@${streamName}`])
  }
}
