export type TLinearHistory = number[][]

export type TCandlesPoint = {
  close: number
  high: number
  low: number
  open: number
  time: number
  volumefrom: number
  volumeto: number
}

export type TCandlesHistory = TCandlesPoint[]

export type TLinearChartData = number[]

export type TContainer = Element | string

export interface TLinearChartOptions {
  chartStroke?: {
    width?: number
    hoverWidth?: number
    color?: string
  }
  chartFill?: {
    gradientStart?: string
    gradientEnd?: string
  }
}
