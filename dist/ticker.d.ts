import { HistoryData } from "./types";
declare type HistoryInterval = 'day' | 'hour' | 'minute';
export declare class Ticker {
    state: {
        PRICE: number;
        LASTUPDATE: number;
    };
    private apiKey;
    constructor(symbol: string);
    fetchHistory(symbol: string, interval: HistoryInterval): Promise<HistoryData>;
    initBinance(symbol: string): void;
    initCryptoCompare(symbol: string): void;
}
export {};
