"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ticker = void 0;
const utils_1 = require("../utils");
class Ticker {
    constructor(symbol, interval) {
        this.range = '5d';
        this.ws = null;
        this.listeners = [];
        this.symbol = symbol;
        this.interval = interval;
        this.init();
    }
    get currency() {
        return (0, utils_1.symbolToCurrency)(this.symbol);
    }
    setSymbol(value) {
        this.symbol = value;
        this.init();
    }
    setInterval(value) {
        this.interval = value;
        this.init();
    }
    setRange(value) {
        this.range = value;
        this.interval = (0, utils_1.getIntervalByDateRange)(value);
    }
    get historyRange() {
        let cur = +new Date();
        return [cur - (0, utils_1.dateRangeToMilliseconds)(this.range), cur];
    }
    async fetchHistory() {
        let params = {
            symbol: this.symbol + 'USDT',
            interval: this.interval,
            startTime: this.historyRange[0],
            endTime: this.historyRange[1],
            limit: 1000
        };
        let response = await fetch(`https://api.binance.com/api/v3/klines?${Object.entries(params)
            .map(([k, v]) => k + '=' + v)
            .join('&')}`, {
            method: 'GET'
        });
        let data = (await response.json()).map(([time, open, high, low, close, volume]) => ({
            time,
            open: +open,
            high: +high,
            low: +low,
            close: +close,
            volume: +volume
        }));
        return data;
    }
    init() {
        var _a;
        (_a = this.ws) === null || _a === void 0 ? void 0 : _a.close();
        this.state = null;
        this.subscribe();
    }
    subscribe() {
        this.ws = new WebSocket(`wss://stream.binance.com:9443/ws/${this.symbol.toLowerCase()}usdt@kline_${this.interval}`);
        this.ws.onmessage = (event) => {
            var _a;
            let data = JSON.parse(event.data);
            if ((_a = data.s) === null || _a === void 0 ? void 0 : _a.startsWith(this.symbol)) {
                this.state = {
                    PRICE: +data.k.c,
                    LASTUPDATE: Math.floor(data.k.t / 1000),
                    open: +data.k.o,
                    high: +data.k.h,
                    low: +data.k.l,
                    close: +data.k.c
                };
                this.listeners.forEach(cb => cb(this.state));
            }
        };
        this.ws.onclose = () => {
            setTimeout(this.subscribe.bind(this), 1000);
        };
    }
    addListener(cb) {
        this.listeners.push(cb);
    }
}
exports.Ticker = Ticker;
//# sourceMappingURL=ticker.js.map