import { Chart } from '../../core'
import { Component } from '../../core/component'

export default abstract class ChartStyle extends Component {
  style: Chart.StyleName

  abstract bars: boolean

  constructor(chart: Chart) {
    super(chart)
    this.style = chart.options.style
  }
}
