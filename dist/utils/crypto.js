import scmap from '../data/scmap.json';
export const symbolToCurrency = (value) => scmap[value.toUpperCase()];
