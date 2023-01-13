import moment from 'moment';
import { defaultDataProviderOptions } from '../config/data-provider-options';
import { getIntervalByDateRange, symbolToCurrency, IntervalWeights } from '../utils';
import BinanceAPIClient from './binance-api-client';
export class DataProvider {
    get api() {
        return this._client;
    }
    get symbol() {
        return this._opts.fromSymbol + this._opts.toSymbol;
    }
    get currency() {
        return symbolToCurrency(this._opts.fromSymbol);
    }
    get historyRange() {
        let veryBeginning = moment([2009, 0, 3]).unix();
        let end = +new Date();
        let start = Math.max(end - IntervalWeights[this._opts.interval] * 1000, veryBeginning);
        return [start, end];
    }
    constructor(opts) {
        this._opts = defaultDataProviderOptions;
        this._client = new BinanceAPIClient();
        this.listeners = [];
        this.applyOptions(opts);
        this.init();
    }
    applyOptions(opts) {
        Object.keys(opts).forEach(option => {
            this._opts[option] = opts[option];
        });
    }
    async requestHistory() {
        const data = await this.api.getKLines({
            symbol: this.symbol,
            interval: this._opts.interval,
            startTime: this.historyRange[0],
            endTime: this.historyRange[1],
            limit: 1000
        });
        const bar = data[data.length - 1];
        this.state = {
            PRICE: bar.close,
            LASTUPDATE: bar.time,
            open: bar.open,
            high: bar.high,
            low: bar.low,
            close: bar.close
        };
        this.listeners.forEach(cb => cb(this.state));
        return data;
    }
    init() {
        this.state = null;
        this.api.disconnect();
        this.api.connect(async () => {
            this.api.subscribe(this.symbol, `kline_${this._opts.interval}`);
            this.api.subscribe(this.symbol, `depth@100ms`);
            this.api.onStreamEvent('kline', (data) => {
                var _a;
                if (data.s === this.symbol) {
                    this.state = {
                        PRICE: +data.k.c,
                        LASTUPDATE: Math.floor(data.k.t / 1000),
                        open: +data.k.o,
                        high: +data.k.h,
                        low: +data.k.l,
                        close: +data.k.c
                    };
                    (_a = window.xenoview) === null || _a === void 0 ? void 0 : _a.updateCurrentPoint(this.state);
                    this.listeners.forEach(cb => cb(this.state));
                }
            });
            this.api.onStreamEvent('depthUpdate', (data) => {
                if (data.s === this.symbol) {
                    this.listeners.forEach(cb => cb(data));
                }
            });
        });
    }
    addListener(cb) {
        this.listeners.push(cb);
    }
    setFromSymbol(value) {
        this.applyOptions({ fromSymbol: value });
        this.init();
    }
    setToSymbol(value) {
        this.applyOptions({ toSymbol: value });
        this.init();
    }
    setInterval(value) {
        this.applyOptions({ interval: value });
        this.init();
    }
    setRange(value) {
        this.applyOptions({
            range: value,
            interval: getIntervalByDateRange(value)
        });
    }
}
