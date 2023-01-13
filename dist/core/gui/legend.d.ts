import { Chart } from '../..';
import Configurable from '../../models/configurable';
type LegendOptions = Partial<{
    symbolTitle: boolean;
    openMarketStatus: boolean;
    OHLCValues: boolean;
    barChangeValues: boolean;
    volume: boolean;
    showBuySellButtons: boolean;
    provider?: boolean;
    xenoview?: boolean;
}>;
export default class Legend implements Configurable<LegendOptions> {
    _opts: LegendOptions;
    private _container;
    private _chart;
    constructor(container: HTMLElement, chart: Chart, opts: LegendOptions);
    applyOptions(opts: LegendOptions): void;
    update(ohlc?: boolean): void;
    getTitle(): string;
    getOHLCValues(): string;
}
export {};
