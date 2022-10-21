export const getTimeFromTimestamp = (ts: number): string => {
  let date = new Date(ts)
  let h = date.getHours().toString().padStart(2, '0')
  let m = date.getMinutes().toString().padStart(2, '0')

  return h + ':' + m
}

// TODO: multiply ts by 1000 if needed
export const getFullTimeFromTimestamp = (ts: number): string => {
  let date = new Date(ts)
  let y = date.getFullYear().toString().slice(2).padStart(3, `'`)
  let M = date.toLocaleString('en-US', { month: 'short' })
  let d = date.getDate().toString().padStart(2, '0')
  let h = date.getHours().toString().padStart(2, '0')
  let m = date.getMinutes().toString().padStart(2, '0')

  return `${d} ${M} ${y}  ${h}:${m}`
}

export const toMinutes = (ts: number): number => {
  if (ts.toString().length != (+new Date()).toString().length) ts *= 1000
  let date = new Date(ts)
  return +new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    date.getHours(),
    date.getMinutes()
  )
}

export const dayOfYear = (date: any) =>
  Math.floor(
    (date - (new Date(date.getFullYear(), 0, 0) as any)) / 1000 / 60 / 60 / 24
  )

export const intervalToMiliseconds = (value: Ticker.Interval) => {
  const intervalMap: { [key in Ticker.Interval]: number } = {
    '1s': 1000,
    '1m': 60000,
    '3m': 60000 * 3,
    '5m': 60000 * 5,
    '15m': 60000 * 15,
    '30m': 60000 * 30,
    '1h': 60000 * 60,
    '2h': 60000 * 60 * 2,
    '4h': 60000 * 60 * 4,
    '6h': 60000 * 60 * 6,
    '8h': 60000 * 60 * 8,
    '12h': 60000 * 60 * 12,
    '1d': 60000 * 60 * 24,
    '3d': 60000 * 60 * 24 * 3,
    '1w': 60000 * 60 * 24 * 7,
    '1M': 60000 * 60 * 24 * 30
  }

  return intervalMap[value]
}

export const dateRangeToMilliseconds = (value: Ticker.DateRange) => {
  let d = 86400000
  let dateRangeMap: { [range in Ticker.DateRange]: number } = {
    '1d': d,
    '5d': d * 5,
    '1M': d * 30,
    '3M': d * 30 * 3,
    '6M': d * 30 * 6,
    ytd: d * dayOfYear(new Date()),
    '1y': d * 365,
    '5y': d * 365 * 5,
    all: undefined
  }

  return dateRangeMap[value]
}

export const getIntervalByDateRange = (value: Ticker.DateRange) => {
  let map: { [range in Ticker.DateRange]: Ticker.Interval } = {
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
  return map[value]
}
