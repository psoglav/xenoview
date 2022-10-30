import { Chart, Canvas } from '.'

export abstract class Component {
  chart: Chart

  constructor(chart: Chart) {
    this.chart = chart
  }

  abstract update(canvas: Canvas): void
}
