export default function toKm(meters: number): number {
  return Math.round(meters / 100) / 10;
}
