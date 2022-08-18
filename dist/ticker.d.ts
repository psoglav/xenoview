import { HistoryData } from './types';
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
    symbol: string;
    private apiKey;
    constructor(symbol: string, apiKey?: string);
    get currency(): any;
    fetchHistory(symbol: string, interval: HistoryInterval): Promise<HistoryData>;
    initBinance(symbol: string): void;
    initCryptoCompare(symbol: string): void;
}
export {};
