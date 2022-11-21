export declare const timeTickMark: (ts: number) => string;
export declare const currentTimeTickMark: (ts: number) => string;
export declare const toMinutes: (ts: number) => number;
export declare const dayOfYear: (date: any) => number;
export declare const timeUnitWeightMap: Readonly<{
    year: 31536000000;
    quarter: 7776000000;
    month: 2592000000;
    week: 604800000;
    day: 86400000;
    hour: 3600000;
    minute: 60000;
    second: 1000;
}>;
export declare enum IntervalWeights {
    '1s' = 1000,
    '1m' = 60000,
    '3m' = 180000,
    '5m' = 300000,
    '15m' = 900000,
    '30m' = 1800000,
    '1h' = 3600000,
    '2h' = 7200000,
    '4h' = 14400000,
    '6h' = 21600000,
    '8h' = 28800000,
    '12h' = 43200000,
    '1d' = 86400000,
    '3d' = 259200000,
    '1w' = 604800000,
    '1M' = 2592000000
}
declare const dateRangeToIntervalMap: {
    [range: string]: Interval;
};
export declare const getTimeUnitWeight: (value: any) => number;
export declare const timeUnitToRange: (value: string, start?: number) => [number, number];
export declare const getIntervalByDateRange: (value: keyof typeof dateRangeToIntervalMap) => Interval;
export {};
