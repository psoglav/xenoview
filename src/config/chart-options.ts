import { DataProviderOptions } from '@/core/data-provider'

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
  }
}