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
  let date = new Date(ts)
  return +new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    date.getHours(),
    date.getMinutes(),
  )
}