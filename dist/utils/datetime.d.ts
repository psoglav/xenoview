import { Interval } from '../types/time.d';
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
declare const dateRangeToIntervalMap: {
    [range: string]: Interval;
};
export declare const getTimeUnitWeight: (value: any) => number;
export declare const timeUnitToRange: (value: string, start?: number) => [number, number];
export declare const getIntervalByDateRange: (value: keyof typeof dateRangeToIntervalMap) => Interval;
export {};
