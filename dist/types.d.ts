export interface ChartOptions {
    bgColor?: string;
    textColor?: string;
    pointer?: {
        fgColor: string;
        bgColor: string;
    };
    candles?: {
        colors: {
            higher: string;
            lower: string;
        };
    };
    xAxis?: {
        labels: {
            fontSize: number;
        };
    };
    yAxis?: {
        labels: {
            fontSize: number;
        };
    };
}
export interface ChartBoundingRect {
    left: number;
    right: number;
    top: number;
    bottom: number;
}
export declare type LinearHistory = number[][];
export declare type HistoryPoint = {
    close: number;
    high: number;
    low: number;
    open: number;
    time: number;
};
export declare type HistoryData = HistoryPoint[];
export declare type ChartData = number[];
export declare type ChartContainer = Element | string;
