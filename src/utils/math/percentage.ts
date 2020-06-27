export function calculatePercentage(numerateur: number, denominateur: number) {
  return numerateur !== 0 ? (denominateur * 100) / numerateur : 0
}
