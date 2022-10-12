export * from './candles'
export * from './line'
export * from './area'
export * from './bars'

import { Candles, Line, Area, Bars } from '.'
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
  }
}
