import { UIElement } from '../ui'

declare global {
  namespace UI {
    type Position = {x: number, y: number}
    type LabelOptions = {
      value: any
      x: number
      y: number
      font: string
      size: number
      color: string | Function
      ctx: CanvasRenderingContext2D
    }
    type ElementOptions = {
      x: number
      y: number
      ctx: CanvasRenderingContext2D
    }
    type ElementGroupOptions = {
      x: number
      y: number
      ctx: CanvasRenderingContext2D
      elements: (UIElement | number)[]
      gap: number
    }
  }

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
      labels?: {
        fontSize: number
      }
      fit?: boolean
    }
  }
  
  export interface ChartBoundingRect {
    y: number
    left: number
    right: number
  }
  
  export type LinearHistory = number[][]
  
  export type HistoryPoint = {
    close: number
    high: number
    low: number
    open: number
    time: number
    // volumefrom: number
    // volumeto: number
  }
  
  export type HistoryData = HistoryPoint[]
  
  export type ChartData = number[]
  
  export type ChartContainer = Element | string
}

export { }