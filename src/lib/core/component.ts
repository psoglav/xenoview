import { Chart } from './chart'

// Perhaps this class should extend Chart
// Because the way it's currently done brings more complexity
export abstract class Component {
  chart: Chart

  constructor(chart: Chart) {
    this.chart = chart
  }

  abstract update(): void
}
