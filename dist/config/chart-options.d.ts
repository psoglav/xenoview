import { DataProviderOptions } from './data-provider-options';
export interface ChartOptions {
    dataProvider?: DataProviderOptions;
    style?: Chart.StyleName;
    bgColor?: string;
    textColor?: string;
    autoScale?: boolean;
    spinnerColor?: string;
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
    line?: {
        color: string;
        width: number;
    };
    timeAxis?: {
        labels: {
            fontSize: number;
        };
    };
    priceAxis?: {
        labels?: {
            fontSize: number;
        };
    };
}
export declare const defaultChartOptions: ChartOptions;
