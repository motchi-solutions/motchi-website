/** CSS optimizers may serialize milliseconds as seconds (2600ms → 2.6s). */
export function motionMilliseconds(value: string, fallback: number): number {
  const time = value.trim();
  if (!/^(?:\d+(?:\.\d+)?|\.\d+)(?:ms|s)$/.test(time)) return fallback;
  const amount = Number.parseFloat(time);
  const milliseconds = time.endsWith("ms") ? amount : amount * 1000;
  return Number.isFinite(milliseconds) ? milliseconds : fallback;
}
