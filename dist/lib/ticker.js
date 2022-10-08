"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ticker = void 0;
const utils_1 = require("../utils");
class Ticker {
    constructor(symbol, apiKey) {
        this.ws = null;
        this.apiKey = '';
        this.sym = symbol;
        this.apiKey = apiKey;
        this.init();
    }
    get currency() {
        return (0, utils_1.symbolToCurrency)(this.sym);
    }
    get symbol() {
        return this.sym;
    }
    set symbol(value) {
        this.sym = value;
        this.init();
    }
    async fetchHistory(symbol, interval, limit) {
        let params = {
            fsym: symbol,
            tsym: 'USD',
            tryConversion: false,
        };
        if (limit)
            params.limit = limit;
        let q = Object.entries(params)
            .map(([k, v]) => k + '=' + v)
            .join('&');
        let response = await fetch(`https://min-api.cryptocompare.com/data/v2/histo${interval}?${q}`, {
            method: 'GET',
            headers: {
                Authorization: 'Apikey ' + this.apiKey,
            },
        });
        return (await response.json()).Data.Data;
    }
    init() {
        var _a;
        (_a = this.ws) === null || _a === void 0 ? void 0 : _a.close();
        this.state = null;
        this.initBinance();
    }
    initBinance() {
        this.ws = new WebSocket(`wss://stream.binance.com:9443/ws/${this.sym.toLowerCase()}usdt@kline_1m`);
        this.ws.onmessage = (event) => {
            var _a;
            let data = JSON.parse(event.data);
            if ((_a = data.s) === null || _a === void 0 ? void 0 : _a.startsWith(this.sym)) {
                this.state = {
                    PRICE: +data.k.c,
                    LASTUPDATE: Math.floor(data.k.t / 1000),
                    open: +data.k.o,
                    high: +data.k.h,
                    low: +data.k.l,
                    close: +data.k.c,
                };
            }
        };
        this.ws.onclose = () => {
            setTimeout(this.initBinance, 1000);
        };
    }
    initCryptoCompare(symbol) {
        this.ws = new WebSocket('wss://streamer.cryptocompare.com/v2?api_key=' + this.apiKey);
        this.ws.onopen = () => {
            let subRequest = {
                action: 'SubAdd',
                subs: [`2~Coinbase~${symbol}~USD`],
            };
            this.ws.send(JSON.stringify(subRequest));
        };
        this.ws.onmessage = (event) => {
            let data = JSON.parse(event.data);
            if (data.TYPE == 2) {
                this.state = data;
            }
        };
    }
}
exports.Ticker = Ticker;
//# sourceMappingURL=ticker.js.map