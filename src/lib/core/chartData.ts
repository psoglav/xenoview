import { toMinutes, normalizeTo } from '../../utils'

import { Chart } from './chart'

export abstract class ChartData {
  history: History.Data
  chartData: History.Data

  highestPrice: [number, number] = [0, 0]
  lowestPrice: [number, number] = [0, 0]

  renderedChartLength: number = 0

  private chart: Chart

  get chartFullWidth(): number {
    return this.chart.boundingRect.right - this.chart.boundingRect.left
  }

  get pointsGap(): number {
    return this.chartFullWidth / this.history.length
  }

  constructor() {}

  initData(chart: Chart) {
    this.chart = chart
  }

  updatePoint(
    point: History.Point,
    value: { PRICE: number; LASTUPDATE: number }
  ) {
    point.close = value.PRICE
    point.time = value.LASTUPDATE

    if (point.close < point.low) point.low = point.close
    if (point.close > point.high) point.high = point.close
  }

  updateCurrentPoint(value: any) {
    let hist = this.history
    if (!hist?.length) return
    let currentPoint = hist[hist.length - 1]

    if (
      !value?.PRICE ||
      !value?.LASTUPDATE ||
      currentPoint.close === value.PRICE
    )
      return

    let pointMinutesTs = toMinutes(value.LASTUPDATE)
    let currentPointMinutesTs = toMinutes(currentPoint.time)

    if (currentPointMinutesTs == pointMinutesTs) {
      this.updatePoint(hist[hist.length - 1], value)
    } else if (pointMinutesTs > currentPointMinutesTs) {
      let pp = hist[hist.length - 1]

      if (value.PRICE < pp.low) pp.low = value.PRICE
      if (value.PRICE > pp.high) pp.high = value.PRICE

      pp.close = value.PRICE

      hist.shift()
      hist.push({
        time: value.LASTUPDATE,
        high: value.PRICE,
        open: value.PRICE,
        close: value.PRICE,
        low: value.PRICE
      })
    }

    this.chart.chartLayer.needsUpdate = true
  }

  getPointX(value): number {
    let i = value
    let data = this.history
    if (typeof value == 'object') i = data.indexOf(value)
    return (
      this.chart.boundingRect.left + (this.chartFullWidth / data.length) * i
    )
  }

  get visibleRange(): number[] {
    let left = this.chart.boundingRect.left,
      width = this.chart.mainCanvasWidth,
      start = Math.round((left * -1) / this.pointsGap),
      end = Math.round((left * -1 + width) / this.pointsGap)

    start = Math.max(start-1, 0)
    end = Math.min(end, this.history.length - 1)
    return [start, end]
  }

  get visiblePoints() {
    return this.history?.slice(...this.visibleRange)
  }

  get lastPoint(): History.Point {
    return this.history[this.history.length - 1]
  }

  get lastVisiblePoint(): History.Point {
    return this.history[this.visibleRange[1]]
  }

  normalizeToPrice(y: number) {
    let minY = this.chart.boundingRect.bottom
    let maxY = this.chart.boundingRect.top

    let minPrice = this.lowestPrice[1]
    let maxPrice = this.highestPrice[1]

    return minPrice + normalizeTo(y, minY, maxY, minPrice, maxPrice)
  }

  normalizeToY(price: number) {
    let minY = this.chart.boundingRect.bottom
    let maxY = this.chart.boundingRect.top

    let minPrice = this.lowestPrice[1]
    let maxPrice = this.highestPrice[1]

    return minY + normalizeTo(price, minPrice, maxPrice, minY, maxY)
  }

  normalizePoint(point: History.Point): History.Point {
    return {
      ...point,
      close: this.normalizeToY(point.close),
      open: this.normalizeToY(point.open),
      high: this.normalizeToY(point.high),
      low: this.normalizeToY(point.low)
    }
  }

  normalizeData(): History.Data {
    let hist = this.history
    if (!hist?.length) return []
    return hist.map(point => this.normalizePoint(point))
  }

  getHighestAndLowestPrice() {
    let history: any = this.visiblePoints

    if (!history) return

    let { high, low } = history[0]
    this.highestPrice = [0, high]
    this.lowestPrice = [0, low]

    history.forEach((p, i) => {
      if (p.high > this.highestPrice[1]) {
        this.highestPrice = [i, p.high]
      }
      if (p.low < this.lowestPrice[1]) {
        this.lowestPrice = [i, p.low]
      }
    })
  }

  getGridRows() {
    let t = this.highestPrice[1]
    let b = this.lowestPrice[1]

    if (t == 0 && b == 0) return []

    t = Math.floor(t / 10) * 10
    b = Math.floor(b / 10) * 10
    let delta = t - b

    let result = []
    let length = delta / 10
    let start = 0
    let end = length

    let step = 1

    while (
      this.normalizeToY((start / length) * delta + b) <
      this.chart.getWidth(this.chart.ctx)
    ) {
      start -= step
      step += 5
      if (start < -5000) break
    }

    step = 0

    while (this.normalizeToY((end / length) * delta + b) > 0) {
      end += step
      step += 5
      if (end > 5000) break
    }

    for (let i = start; i <= end; i++) {
      result.push((i / length) * delta + b)
    }

    let prev = 0

    return result.filter(i => {
      let y = this.normalizeToY(i)
      let py = this.normalizeToY(prev)

      if (py - y < 30 && y != py) {
        return 0
      }

      prev = i
      return 1
    })
  }

  getGridColumns() {
    let prev = 0
    return this.history
      .map((_, i) => i)
      .filter(i => {
        let x = this.getPointX(i)
        let px = this.getPointX(prev)

        if (x - px < 100 && x != px) {
          return 0
        }

        prev = i
        return 1
      })
  }
}
