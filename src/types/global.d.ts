import { Nominal } from '../models/nominal'
import { Chart } from '../core'

declare global {
  interface Window {
    xenoview: Chart
  }

  type Vector = { x: number; y: number }
  type Rect = { x: number; y: number; width: number; height: number }

  type OrderType = 'market' | 'limit' | 'stop'
  type OrderSide = 'buy' | 'sell'
  type OrderSymbol = 'BTC' | 'ETH' | 'LTC'
  type OrderStatus = 'working' | 'canceled' | 'fulfilled'

  export type OrderModel = {
    id: string
    at: number
    status: OrderStatus
    type: OrderType
    side: OrderSide
    symbol: OrderSymbol
    price: number
    units: number
    deltaPrice?: number
    isHovered?: boolean
    isGrabbed?: boolean
    disabled?: boolean
  }

  type ChartEventType = 'order:fulfilled' | 'order:canceled' | 'order:canceled'

  export namespace Chart {
    type StyleName = 'candles' | 'line' | 'area' | 'bars' | 'hollow-candles'
    interface BoundingRect {
      left: number
      right: number
      top: number
      bottom: number
      offsetX: number
      offsetY: number
    }
    type Data = number[]
    type Container = Element | string
  }

  export namespace History {
    type Point = {
      close: number
      high: number
      low: number
      open: number
      time: number
      // volumefrom: number
      // volumeto: number
    }
    type Data = Point[]
  }

  export type Timestamp = Nominal<number, 'Timestamp'>

  export type DateRange = '1d' | '5d' | '1M' | '3M' | '6M' | 'ytd' | '1y' | '5y' | 'all'

  export type Interval =
    | '1s'
    | '1m'
    | '3m'
    | '5m'
    | '15m'
    | '30m'
    | '1h'
    | '2h'
    | '4h'
    | '6h'
    | '8h'
    | '12h'
    | '1d'
    | '3d'
    | '1w'
    | '1M'
}

export {}
