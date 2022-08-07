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
export declare type TLinearGraphData = number[];
export declare type TContainer = Element | string;
export interface TLinearGraphOptions {
    graphStroke?: {
        width?: number;
        hoverWidth?: number;
        color?: string;
    };
    graphFill?: {
        gradientStart?: string;
        gradientEnd?: string;
    };
}
