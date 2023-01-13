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
    trading?: {
        colors: {
            buy: string;
            sell: string;
        };
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
    legend?: {
        provider?: boolean;
        xenoview?: boolean;
    };
}
export declare const defaultChartOptions: ChartOptions;
