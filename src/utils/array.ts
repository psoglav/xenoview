export function rangeByStep(
  start: number,
  end: number,
  step: number,
): number[] {
  if (end === start || step === 0) {
    return [start]
  }
  if (step < 0) {
    step = -step
  }
  const stepNumOfDecimal = step.toString().split('.')[1]?.length || 0
  const endNumOfDecimal = end.toString().split('.')[1]?.length || 0

  const maxNumOfDecimal = Math.max(stepNumOfDecimal, endNumOfDecimal)
  const power = Math.pow(10, maxNumOfDecimal)
  const increment = end - start > 0 ? step : -step
  const intEnd = Math.floor(end * power)

  const isFulFilled =
    end - start > 0
      ? (current: number) => current > intEnd
      : (current: number) => current < intEnd

  const result = []
  let current = start
  while (true) {
    result.push(current)
    // to address floating value
    const intValue = Math.floor(current * power) + Math.floor(increment * power)
    current = intValue / power
    if (isFulFilled(intValue)) {
      break
    }
  }
  return result
}