import { Chart } from '../..'
import Configurable from '../../models/configurable'
import { symbolToCurrency } from '../../utils/crypto'

type LegendOptions = Partial<{
  symbolTitle: boolean
  openMarketStatus: boolean
  OHLCValues: boolean
  barChangeValues: boolean
  volume: boolean
  showBuySellButtons: boolean
}>

export default class Legend implements Configurable<LegendOptions> {
  _opts: LegendOptions

  private _container: HTMLElement
  private _chart: Chart

  constructor(container: HTMLElement, chart: Chart, opts: LegendOptions) {
    this._chart = chart
    this._container = container

    this.applyOptions(opts)
    this.update(false)
  }

  applyOptions(opts: LegendOptions): void {
    Object.keys(opts).forEach(option => {
      this._opts[option] = opts[option]
    })
  }

  update(ohlc = true) {
    this._container.innerHTML = this.getTitle() + (ohlc ? this.getOHLCValues() : '')
  }

  getTitle() {
    let { fromSymbol, toSymbol } = this._chart.dataProvider._opts
    let c1 = symbolToCurrency(fromSymbol)
    let c2 = symbolToCurrency(toSymbol)
    return `<div class="title-wrapper">
              <div class="title-wrapper__symbol-title">${c1} / ${c2}</div>
              <div class="title-wrapper__interval-title">${this._chart.dataProvider._opts.interval}</div>
              <div class="title-wrapper__provider-title">BINANCE</div>
              <div class="title-wrapper__brand-title">XenoView</div>
            </div>`
  }

  getOHLCValues() {
    let { open, high, low, close } = this._chart.pointer.focusedPoint || this._chart.lastPoint
    let h = (n: string, val: number) =>
      `<div>${n}<span style="color:${
        this._chart._opts.candles.colors[close < open ? 'lower' : 'higher']
      }">${val}</span></div>`
    return `<div class="ohlc-values">${h('O', open) + h('H', high) + h('L', low) + h('C', close)}</div>`
  }
}
