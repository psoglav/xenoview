import Configurable from '@/models/configurable';
import { DataProviderOptions } from '../config/data-provider-options';
import { DateRange, Interval } from '../types/time.d';
import BinanceAPIClient from './binance-api-client';
declare type CurrentBarState = {
    PRICE: number;
    LASTUPDATE: number;
    open: number;
    high: number;
    low: number;
    close: number;
};
export declare type ListenerFunction = (state: CurrentBarState) => void;
export declare class DataProvider implements Configurable<DataProviderOptions> {
    _opts: DataProviderOptions;
    state: CurrentBarState;
    private _client;
    private readonly listeners;
    get api(): BinanceAPIClient;
    get symbol(): string;
    get currency(): any;
    get historyRange(): [number, number];
    constructor(opts: DataProviderOptions);
    applyOptions(opts: DataProviderOptions): void;
    requestHistory(): Promise<History.Data>;
    init(): void;
    addListener(cb: ListenerFunction): void;
    setFromSymbol(value: any): void;
    setToSymbol(value: any): void;
    setInterval(value: Interval): void;
    setRange(value: DateRange): void;
}
export {};
