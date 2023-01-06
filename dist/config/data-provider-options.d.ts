export type DataProviderOptions = Partial<{
    fromSymbol: string;
    toSymbol: string;
    symbol: string;
    interval: Interval;
    range: DateRange;
    realtime: boolean;
    continuous: boolean;
}>;
export declare const defaultDataProviderOptions: DataProviderOptions;
