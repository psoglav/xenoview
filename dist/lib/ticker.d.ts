export declare class Ticker {
    state: Ticker.State;
    private symbol;
    private interval;
    private range;
    private ws;
    private listeners;
    constructor(symbol: string, interval: Ticker.Interval);
    get currency(): any;
    setSymbol(value: any): void;
    setInterval(value: Ticker.Interval): void;
    setRange(value: Ticker.DateRange): void;
    get historyRange(): [number, number];
    fetchHistory(): Promise<History.Data>;
    init(): void;
    subscribe(): void;
    addListener(cb: Ticker.Listener): void;
}
