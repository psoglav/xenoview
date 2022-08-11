export interface ChartOptions {
  bgColor?: string
  textColor?: string
  pointer?: {
    fgColor: string
    bgColor: string
  }
  candles?: {
    colors: {
      higher: string
      lower: string
    }
  }
  xAxis?: {
    labels: {
      fontSize: number
    }
  }
  yAxis?: {
    labels: {
      fontSize: number
    }
  }
}

export interface ChartBoundingRect {
  left: number
  right: number
  top: number
  bottom: number
}

export type LinearHistory = number[][]

export type HistoryPoint = {
  close: number
  high: number
  low: number
  open: number
  time: number
  volumefrom: number
  volumeto: number
}

export type HistoryData = HistoryPoint[]

export type ChartData = number[]

export type ChartContainer = Element | string