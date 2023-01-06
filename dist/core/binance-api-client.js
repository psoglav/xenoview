export default class BinanceAPIClient {
    get connected() {
        return this._ws && this._ws.readyState === this._ws.OPEN;
    }
    constructor() {
        this._baseURL = 'https://api.binance.com/api/v3';
        this._wssStreamURL = 'wss://stream.binance.com:9443';
        this._ws = null;
        this._counter = 0;
    }
    async get(endpoint, params) {
        return await fetch(this._baseURL +
            endpoint +
            `?${Object.entries(params)
                .map(([k, v]) => k + '=' + v)
                .join('&')}`, {
            method: 'GET'
        });
    }
    async getKLines(params) {
        const response = await this.get('/klines', params);
        return (await response.json()).map(([time, open, high, low, close, volume]) => ({
            time,
            open: +open,
            high: +high,
            low: +low,
            close: +close,
            volume: +volume
        }));
    }
    async getDepth(symbol, limit) {
        const response = await this.get('/depth', { symbol, limit });
        return await response.json();
    }
    connect(onopen, onerror) {
        this._ws = new WebSocket(`${this._wssStreamURL}/ws`);
        if (onopen)
            this._ws.addEventListener('open', onopen);
        if (onerror)
            this._ws.addEventListener('error', onerror);
    }
    on(event, cb) {
        if (!this.connected)
            throw new Error('WebSocket is closed or undefined');
        this._ws.addEventListener(event, (e) => cb(JSON.parse(e.data)));
    }
    onStreamEvent(eventType, cb) {
        this.on('message', (data) => {
            if (data.e == eventType) {
                cb(data);
            }
        });
    }
    disconnect() {
        var _a;
        (_a = this._ws) === null || _a === void 0 ? void 0 : _a.close();
    }
    emit(method, params) {
        const id = +new Date() + this._counter++;
        this._ws.send(JSON.stringify({
            method,
            params,
            id
        }));
        return new Promise((resolve, reject) => {
            this.on('message', (data) => {
                if (data.id === id) {
                    resolve(data.result);
                }
                else if (data.error) {
                    reject();
                }
            });
        });
    }
    subscribe(symbol, streamName) {
        return this.emit('SUBSCRIBE', [`${symbol.toLowerCase()}@${streamName}`]);
    }
    unsubscribe(symbol, streamName) {
        return this.emit('UNSUBSCRIBE', [`${symbol.toLowerCase()}@${streamName}`]);
    }
}
