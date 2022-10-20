export * from './candles'
export * from './line'
export * from './area'
export * from './bars'
export * from './hollowCandles'

import { Candles, Line, Area, Bars, HollowCandles } from '.'
import { Chart } from '@/lib/core'
import { ChartStyle } from '@/lib/components'

const CachedStyles: { [key: string]: ChartStyle } = {}

const cacheStyle = (style: Chart.StyleName, instance: ChartStyle) => {
  let cache = CachedStyles
  if (!cache[style]) cache[style] = instance
  return cache[style]
}

export function createChartStyle(chart: Chart): ChartStyle {
  const style = chart.options.style
  switch (style) {
    case 'candles':
      return cacheStyle(style, new Candles(chart))
    case 'line':
      return cacheStyle(style, new Line(chart))
    case 'area':
      return cacheStyle(style, new Area(chart))
    case 'bars':
      return cacheStyle(style, new Bars(chart))
    case 'hollow-candles':
      return cacheStyle(style, new HollowCandles(chart))
  }
}
