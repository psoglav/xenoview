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
    set symbol(value: any);
    fetchHistory(symbol: string, interval: HistoryInterval): Promise<HistoryData>;
    init(): void;
    initBinance(symbol: string): void;
    initCryptoCompare(symbol: string): void;
}
export {};
