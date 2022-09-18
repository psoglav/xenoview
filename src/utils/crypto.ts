import scmap from '../data/scmap.json'

export const symbolToCurrency = (value: string) => scmap[value.toUpperCase()]