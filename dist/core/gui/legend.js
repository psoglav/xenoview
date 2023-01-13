import { symbolToCurrency } from '../../utils/crypto';
export default class Legend {
    constructor(container, chart, opts) {
        this._opts = {};
        this._chart = chart;
        this._container = container;
        this.applyOptions(opts || {});
        this.update(false);
    }
    applyOptions(opts) {
        Object.keys(opts).forEach(option => {
            this._opts[option] = opts[option];
        });
    }
    update(ohlc = true) {
        this._container.innerHTML = this.getTitle() + (ohlc ? this.getOHLCValues() : '');
    }
    getTitle() {
        var _a, _b;
        let { fromSymbol, toSymbol } = this._chart.dataProvider._opts;
        let c1 = symbolToCurrency(fromSymbol);
        let c2 = symbolToCurrency(toSymbol);
        return `<div class="title-wrapper">
              <div class="title-wrapper__symbol-title">${c1} / ${c2}</div>
              <div class="title-wrapper__interval-title">${this._chart.dataProvider._opts.interval}</div>
              ${((_a = this._opts) === null || _a === void 0 ? void 0 : _a.provider) ? '<div class="title-wrapper__provider-title">BINANCE</div>' : ''}
              ${((_b = this._opts) === null || _b === void 0 ? void 0 : _b.xenoview) ? '<div class="title-wrapper__brand-title">XenoView</div>' : ''}
            </div>`;
    }
    getOHLCValues() {
        let { open, high, low, close } = this._chart.pointer.focusedPoint || this._chart.lastPoint;
        let h = (n, val) => `<div>${n}<span style="color:${this._chart._opts.candles.colors[close < open ? 'lower' : 'higher']}">${val}</span></div>`;
        return `<div class="ohlc-values">${h('O', open) + h('H', high) + h('L', low) + h('C', close)}</div>`;
    }
}
