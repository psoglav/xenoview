import { symbolToCurrency } from './../utils/crypto';
export default class Legend {
    constructor(container, chart, opts) {
        this._chart = chart;
        this._container = container;
        this.applyOptions(opts);
    }
    applyOptions(opts) {
        Object.keys(opts).forEach(option => {
            this._opts[option] = opts[option];
        });
    }
    update() {
        this._container.innerHTML = this.getTitle() + this.getOHLCValues();
    }
    getTitle() {
        let { fromSymbol, toSymbol } = this._chart.dataProvider._opts;
        let c1 = symbolToCurrency(fromSymbol);
        let c2 = symbolToCurrency(toSymbol);
        return `<div class="title-wrapper">
              <div class="title-wrapper__symbol-title">${c1} / ${c2}</div>
              <div class="title-wrapper__interval-title">${this._chart.dataProvider._opts.interval}</div>
              <div class="title-wrapper__provider-title">BINANCE</div>
              <div class="title-wrapper__brand-title">XenoView</div>
            </div>`;
    }
    getOHLCValues() {
        let { open, high, low, close } = this._chart.pointer.focusedPoint || this._chart.lastPoint;
        let h = (n, val) => `<div>${n}<span>${val}</span></div>`;
        return `<div class="bar-values">${h('O', open) + h('H', high) + h('L', low) + h('C', close)}</div>`;
    }
}
