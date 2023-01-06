export const debounce = (cb: Function, timeout = 100) => {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => cb.apply(this, args), timeout)
  }
}
