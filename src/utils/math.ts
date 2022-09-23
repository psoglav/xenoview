export const lerp = (start: number, end: number, t: number) => {
  return start + (end - start) * t
}

export const normalize = (n: number, min: number, max: number): number =>
  (n - min) / (max - min)

export const normalizeTo = (
  from: number,
  fromMin: number,
  fromMax: number,
  toMin: number,
  toMax: number,
): number => (toMax - toMin) * normalize(from, fromMin, fromMax)