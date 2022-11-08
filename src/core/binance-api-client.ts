export enum Interval {
  '1s' = 1000,
  '1m' = 60000,
  '3m' = 180000,
  '5m' = 300000,
  '15m' = 900000,
  '30m' = 1800000,
  '1h' = 3600000,
  '2h' = 7200000,
  '4h' = 14400000,
  '6h' = 21600000,
  '8h' = 28800000,
  '12h' = 43200000,
  '1d' = 86400000,
  '3d' = 259200000,
  '1w' = 604800000,
  '1M' = 2592000000
}

export type KLinesParameters = {
  symbol: string
  interval: Interval
  startTime?: number
  endTime?: number
  limit?: number
}

export default class BinanceAPIClient {
  private _baseURL = 'https://api.binance.com/api/v3'

  constructor() {}

  async request(endpoint: string, params: object) {
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
    const response = await this.request('/klines', params)
    return (await response.json()).map(([time, open, high, low, close, volume]) => ({
      time,
      open: +open,
      high: +high,
      low: +low,
      close: +close,
      volume: +volume
    }))
  }
}
