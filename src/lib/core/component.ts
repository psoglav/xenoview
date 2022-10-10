import { Chart } from './chart'

export abstract class Component {
  chart: Chart

  constructor(chart: Chart) {
    this.chart = chart
  }

  abstract update(): void
}
