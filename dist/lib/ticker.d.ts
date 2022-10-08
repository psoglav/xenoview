declare type HistoryInterval = 'day' | 'hour' | 'minute';
export declare class Ticker {
    state: {
        PRICE: number;
        LASTUPDATE: number;
        open: number;
        high: number;
        low: number;
        close: number;
    } | undefined;
    sym: string;
    private ws;
    private apiKey;
    constructor(symbol: string, apiKey?: string);
    get currency(): any;
    get symbol(): string;
    set symbol(value: string);
    fetchHistory(symbol: string, interval: HistoryInterval, limit?: number): Promise<HistoryData>;
    init(): void;
    initBinance(): void;
    initCryptoCompare(symbol: string): void;
}
export {};
