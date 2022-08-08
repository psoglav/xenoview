export const lerp = (start: number, end: number, t: number) => {
  return start + (end - start) * t;
};

export const getTimeFromTimestamp = (ts: number): string => {
  let date = new Date(ts);
  let h = date.getHours().toString().padStart(2, "0");
  let m = date.getMinutes().toString().padStart(2, "0");

  return h + ":" + m;
};
