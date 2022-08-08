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
export declare type TLinearHistory = number[][];
export declare type TCandlesPoint = {
    close: number;
    high: number;
    low: number;
    open: number;
    time: number;
    volumefrom: number;
    volumeto: number;
};
export declare type TCandlesHistory = TCandlesPoint[];
export declare type TLinearChartData = number[];
export declare type TContainer = Element | string;
export interface TLinearChartOptions {
    chartStroke?: {
        width?: number;
        hoverWidth?: number;
        color?: string;
    };
    chartFill?: {
        gradientStart?: string;
        gradientEnd?: string;
    };
}
