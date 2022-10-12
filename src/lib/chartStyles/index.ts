export * from './candles'
export * from './line'
export * from './area'
export * from './bars'
export * from './hollowCandles'

import { Candles, Line, Area, Bars, HollowCandles } from '.'
import { Chart, ChartStyle } from '../core'

export function createChartStyle(chart: Chart): ChartStyle {
  switch (chart.options.style) {
    case 'candles':
      return new Candles(chart)
    case 'line':
      return new Line(chart)
    case 'area':
      return new Area(chart)
    case 'bars':
      return new Bars(chart)
    case 'hollow-candles':
      return new HollowCandles(chart)
  }
}
