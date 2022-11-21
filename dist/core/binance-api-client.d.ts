import { Interval } from '../types/time';
export declare type KLinesParameters = {
    symbol: string;
    interval: Interval;
    startTime?: number;
    endTime?: number;
    limit?: number;
};
export declare type DepthParameters = {
    symbol: string;
    limit?: number;
};
declare type BinanceStreamEventType = 'kline' | 'trade' | 'aggTrade' | '24hrTicker' | '24hrMiniTicker' | 'depthUpdate' | '1hTicker';
declare type WSEventType = 'close' | 'error' | 'open' | 'message';
export default class BinanceAPIClient {
    private _baseURL;
    private _wssStreamURL;
    private _ws;
    private _counter;
    get connected(): boolean;
    constructor();
    private get;
    getKLines(params: KLinesParameters): Promise<History.Data>;
    getDepth(symbol: string, limit?: number): Promise<any>;
    connect(onopen?: EventListener, onerror?: EventListener): void;
    on(event: WSEventType, cb: EventListener): void;
    onStreamEvent(eventType: BinanceStreamEventType, cb: EventListener): void;
    disconnect(): void;
    private emit;
    subscribe(symbol: string, streamName: string): Promise<unknown>;
    unsubscribe(symbol: string, streamName: string): Promise<unknown>;
}
export {};
