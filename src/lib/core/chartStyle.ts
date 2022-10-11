import { Chart } from '.'

export abstract class ChartStyle {
  type: Chart.Type
  chart: Chart

  constructor(chart: Chart) {
    this.type = chart.options.type
    this.chart = chart
  }

  abstract draw(): void
}