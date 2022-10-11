export * from './candles'

import { Candles } from '.'
import { Chart, ChartStyle } from '../core'

export function createChartStyle(chart: Chart): ChartStyle {
  switch (chart.options.type) {
    case 'candles':
      return new Candles(chart)
    case 'linear':
      return null
  }
}
