declare type HistoryInterval = 'day' | 'hour' | 'minute';
export declare class Ticker {
    state: Ticker.State;
    sym: string;
    private ws;
    private listeners;
    private apiKey;
    constructor(symbol: string, apiKey?: string);
    get currency(): any;
    get symbol(): string;
    set symbol(value: string);
    fetchHistory(symbol: string, interval: HistoryInterval, limit?: number): Promise<History.Data>;
    init(): void;
    initBinance(): void;
    initCryptoCompare(symbol: string): void;
    addListener(cb: Ticker.Listener): void;
}
export {};
