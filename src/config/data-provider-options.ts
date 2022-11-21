export type DataProviderOptions = Partial<{
  fromSymbol: string
  toSymbol: string
  symbol: string
  interval: Interval
  range: DateRange
  realtime: boolean
  continuous: boolean
}>

export const defaultDataProviderOptions: DataProviderOptions = {
  toSymbol: 'USDT',
  interval: '1m',
  range: '1d'
}