import { Chart } from '@/lib/core/chart'
import { UIElement } from '../lib/ui'

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
    interface Options {
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
    interface Position {
      left: number
      right: number
      top: number
      bottom: number
    }
    type Data = number[]
    type Container = Element | string
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
