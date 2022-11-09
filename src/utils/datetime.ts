import { Interval } from '../types/time.d'
import moment from 'moment'

export const timeTickMark = (ts: number): string => {
  let date = moment(ts)
  if (date.get('h') == 0) {
    if (date.get('D') == 1) {
      if (date.get('M') == 0) return date.get('y').toString()
      return date.format('MMM')
    }
    return date.get('D').toString()
  }

  return date.format('HH:mm')
}

export const currentTimeTickMark = (ts: number): string => {
  return moment(ts).format("ddd DD MMM 'YY HH:mm")
}

export const toMinutes = (ts: number): number => {
  if (ts.toString().length != (+new Date()).toString().length) ts *= 1000
  let date = new Date(ts)
  return +new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours(), date.getMinutes())
}

export const dayOfYear = (date: any) =>
  Math.floor((date - (new Date(date.getFullYear(), 0, 0) as any)) / 1000 / 60 / 60 / 24)

export const timeUnitWeightMap = Object.freeze({
  year: 31536000000,
  quarter: 7776000000,
  month: 2592000000,
  week: 604800000,
  day: 86400000,
  hour: 3600000,
  minute: 60000,
  second: 1000
})

const dateRangeToIntervalMap: { [range: string]: Interval } = {
  '1d': '1m',
  '5d': '5m',
  '1M': '30m',
  '3M': '1h',
  '6M': '2h',
  ytd: '1d',
  '1y': '1d',
  '5y': '1w',
  all: '1M'
}

export const getTimeUnitWeight = (value: any): number => {
  return timeUnitWeightMap[moment.normalizeUnits(value)]
}

export const timeUnitToRange = (value: string, start = +new Date()): [number, number] => {
  let t = getTimeUnitWeight(value)
  return [t - start, t]
}

export const getIntervalByDateRange = (value: keyof typeof dateRangeToIntervalMap) => {
  return dateRangeToIntervalMap[value]
}
