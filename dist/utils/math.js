export const lerp = (start, end, t) => {
    return start + (end - start) * t;
};
export const normalize = (n, min, max) => (n - min) / (max - min);
export const normalizeTo = (from, fromMin, fromMax, toMin, toMax) => (toMax - toMin) * normalize(from, fromMin, fromMax);
