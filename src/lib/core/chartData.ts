import { toMinutes, normalizeTo } from '../../utils'

import { Chart } from './chart'

export abstract class ChartData {
  history: History.Data
  chartData: History.Data
  visiblePoints: History.Data

  topHistoryPrice: [number, number] = [0, 0]
  bottomHistoryPrice: [number, number] = [0, 0]

  private chart: Chart

  get chartFullWidth(): number {
    return this.chart.position.right - this.chart.position.left
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
    value: { PRICE: number; LASTUPDATE: number },
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
        low: value.PRICE,
      })
    }

    this.draw()
  }

  /**
   * Get point X position.
   * @param {number | History.Point} value a point or an index of it
   * @returns {number} X position
   */
  getPointX(value): number {
    let i = value
    let data = this.history
    if (typeof value == 'object') i = data.indexOf(value)
    return this.chart.position.left + (this.chartFullWidth / data.length) * i
  }

  filterVisiblePoints(data: any[]) {
    return data.filter((_, i) => {
      let x: number = this.getPointX(i)
      return x > 0 && x < this.chart.mainCanvasWidth
    })
  }

  filterVisiblePointsAndCache() {
    if (!this.history) return []
    this.visiblePoints = this.filterVisiblePoints(this.history)
    return this.visiblePoints
  }

  normalizeToPrice(y: number) {
    let minY = this.chart.position.bottom
    let maxY = this.chart.position.top

    let minPrice = this.bottomHistoryPrice[1]
    let maxPrice = this.topHistoryPrice[1]

    return minPrice + normalizeTo(y, minY, maxY, minPrice, maxPrice)
  }

  normalizeToY(price: number) {
    let minY = this.chart.position.bottom
    let maxY = this.chart.position.top

    let minPrice = this.bottomHistoryPrice[1]
    let maxPrice = this.topHistoryPrice[1]

    return minY + normalizeTo(price, minPrice, maxPrice, minY, maxY)
  }

  normalizePoint(point: History.Point): History.Point {
    return {
      ...point,
      close: this.normalizeToY(point.close),
      open: this.normalizeToY(point.open),
      high: this.normalizeToY(point.high),
      low: this.normalizeToY(point.low),
    }
  }

  normalizeData(): History.Data {
    let hist = this.history
    if (!hist?.length) return []
    return hist.map((point) => this.normalizePoint(point))
  }

  getTopHistoryPrice(): [number, number] {
    let history: any = this.visiblePoints || this.filterVisiblePointsAndCache()
    history = history.map(({ high }) => high)

    let max = history[0]
    let i = 0

    history.forEach((p, ii) => {
      if (p > max) {
        max = p
        i = ii
      }
    })

    this.topHistoryPrice = [i, max]

    return this.topHistoryPrice
  }

  getBottomHistoryPrice(): [number, number] {
    let history: any = this.visiblePoints || this.filterVisiblePointsAndCache()
    history = history.map(({ low }) => low)

    let min = history[0]
    let i = 0

    history.forEach((p, ii) => {
      if (p < min) {
        min = p
        i = ii
      }
    })

    this.bottomHistoryPrice = [i, min]

    return this.bottomHistoryPrice
  }

  getGridRows() {
    let t = this.topHistoryPrice[1]
    let b = this.bottomHistoryPrice[1]

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
      this.chart.getWidth(this.chart.chartContext)
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

    return result.filter((i) => {
      let y = this.normalizeToY(i)
      let py = this.normalizeToY(prev)

      if (py - y < 30 && y != py) {
        return 0
      }

      prev = i
      return 1
    })
  }

  abstract draw(): void
}
