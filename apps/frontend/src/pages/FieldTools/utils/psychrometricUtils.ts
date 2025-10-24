export function calculateDewPoint(tempF: number, rh: number): number {
  const tempC = (tempF - 32) * (5 / 9);
  const b = 17.62;
  const c = 243.12;
  const gamma = Math.log(rh / 100) + (b * tempC) / (c + tempC);
  const dewPointC = (c * gamma) / (b - gamma);
  return (dewPointC * 9) / 5 + 32;
}

export function calculateWetBulb(tempF: number, rh: number): number {
  const tempC = (tempF - 32) * (5 / 9);
  const wetBulbC = tempC * Math.atan(0.151977 * Math.sqrt(rh + 8.313659)) +
    Math.atan(tempC + rh) - Math.atan(rh - 1.676331) +
    0.00391838 * Math.pow(rh, 1.5) * Math.atan(0.023101 * rh) -
    4.686035;
  return (wetBulbC * 9) / 5 + 32;
}

export function calculateRelativeHumidity(tempF: number, dewPointF: number): number {
  const tempC = (tempF - 32) * (5 / 9);
  const dewPointC = (dewPointF - 32) * (5 / 9);
  const b = 17.62;
  const c = 243.12;
  
  const rhDecimal = Math.exp(
    (b * dewPointC) / (c + dewPointC) - (b * tempC) / (c + tempC)
  );
  
  return rhDecimal * 100;
}
