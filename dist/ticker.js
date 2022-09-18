"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Ticker = void 0;
const crypto_1 = require("./utils/crypto");
class Ticker {
    constructor(symbol, apiKey) {
        this.apiKey = '';
        this.symbol = symbol;
        this.apiKey = apiKey;
        this.initBinance(symbol);
    }
    get currency() {
        return (0, crypto_1.symbolToCurrency)(this.symbol);
    }
    async fetchHistory(symbol, interval) {
        let params = {
            // limit: 1000,
            fsym: symbol,
            tsym: 'USD',
            tryConversion: false,
        };
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
    initBinance(symbol) {
        const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}usdt@kline_1m`);
        ws.onmessage = (event) => {
            let data = JSON.parse(event.data);
            this.state = {
                PRICE: +data.k.c,
                LASTUPDATE: Math.floor(data.k.t / 1000),
                open: +data.k.o,
                high: +data.k.h,
                low: +data.k.l,
                close: +data.k.c,
            };
        };
    }
    initCryptoCompare(symbol) {
        const ws = new WebSocket('wss://streamer.cryptocompare.com/v2?api_key=' + this.apiKey);
        ws.onopen = () => {
            let subRequest = {
                action: 'SubAdd',
                subs: [`2~Coinbase~${symbol}~USD`],
            };
            ws.send(JSON.stringify(subRequest));
        };
        ws.onmessage = (event) => {
            let data = JSON.parse(event.data);
            if (data.TYPE == 2) {
                this.state = data;
            }
        };
    }
}
exports.Ticker = Ticker;
//# sourceMappingURL=ticker.js.map