import { DataProviderOptions } from './data-provider-options'

export interface ChartOptions {
  dataProvider?: DataProviderOptions
  style?: Chart.StyleName
  bgColor?: string
  textColor?: string
  autoScale?: boolean
  spinnerColor?: string
  pointer?: {
    fgColor: string
    bgColor: string
  }
  trading?: {
    colors: {
      buy: string
      sell: string
    }
  }
  candles?: {
    colors: {
      higher: string
      lower: string
    }
  }
  line?: {
    color: string
    width: number
  }
  timeAxis?: {
    labels: {
      fontSize: number
    }
  }
  priceAxis?: {
    labels?: {
      fontSize: number
    }
  }
  legend?: {
    provider?: boolean
    xenoview?: boolean
  }
}

export const defaultChartOptions: ChartOptions = {
  style: 'candles',
  bgColor: '#151924',
  textColor: '#b2b5be',
  autoScale: false,
  spinnerColor: '#b2b5be',
  pointer: {
    bgColor: '#363a45',
    fgColor: '#9598a1'
  },
  candles: {
    colors: {
      higher: '#089981',
      lower: '#f23645'
    }
  },
  line: {
    color: '#089981',
    width: 2
  },
  legend: {
    provider: true,
    xenoview: true
  }
}
