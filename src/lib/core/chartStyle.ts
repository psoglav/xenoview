import { Chart } from '.'

export abstract class ChartStyle {
  style: Chart.StyleName
  chart: Chart

  constructor(chart: Chart) {
    this.style = chart.options.style
    this.chart = chart
  }

  abstract draw(): void
}