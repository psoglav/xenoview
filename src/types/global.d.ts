import { UIElement } from '../lib/core'

declare global {
  export namespace UI {
    type Position = { x: number; y: number }
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

  export namespace Chart {
    type StyleName = 'candles' | 'line' | 'area' | 'bars' | 'hollow-candles'
    interface Options {
      style?: Chart.StyleName
      bgColor?: string
      textColor?: string
      autoScale?: boolean
      spinnerColor?: string
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
      line?: {
        color: string
        width: number
      }
      timeAxis?: {
        labels: {
          fontSize: number
        }
      }
      priceAxis?: {
        labels?: {
          fontSize: number
        }
      }
    }
    interface BoundingRect {
      left: number
      right: number
      top: number
      bottom: number
    }
    type Data = number[]
    type Container = Element | string
  }

  export namespace Ticker {
    type Listener = (state: Ticker.State) => void
    type State = {
      PRICE: number
      LASTUPDATE: number
      open: number
      high: number
      low: number
      close: number
    }
  }

  export namespace History {
    type LinearData = number[][]
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
}

export {}
