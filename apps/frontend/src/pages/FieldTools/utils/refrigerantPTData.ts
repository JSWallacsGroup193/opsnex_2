export const refrigerantPTData = {
  'R-22': [
    { temp: 40, pressure: 68 },
    { temp: 45, pressure: 76 },
    { temp: 50, pressure: 84 },
    { temp: 55, pressure: 93 },
    { temp: 60, pressure: 102 },
    { temp: 65, pressure: 112 },
    { temp: 70, pressure: 121 },
    { temp: 75, pressure: 132 },
    { temp: 80, pressure: 143 },
    { temp: 85, pressure: 154 },
    { temp: 90, pressure: 166 },
    { temp: 95, pressure: 179 },
    { temp: 100, pressure: 192 },
    { temp: 105, pressure: 206 },
  ],
  'R-410A': [
    { temp: 40, pressure: 118 },
    { temp: 45, pressure: 127 },
    { temp: 50, pressure: 137 },
    { temp: 55, pressure: 147 },
    { temp: 60, pressure: 158 },
    { temp: 65, pressure: 170 },
    { temp: 70, pressure: 182 },
    { temp: 75, pressure: 195 },
    { temp: 80, pressure: 208 },
    { temp: 85, pressure: 222 },
    { temp: 90, pressure: 237 },
    { temp: 95, pressure: 253 },
    { temp: 100, pressure: 269 },
    { temp: 105, pressure: 286 },
  ],
};

export type Refrigerant = 'R-22' | 'R-410A';

export const saturationTempMap: Record<Refrigerant, (psig: number) => number> = {
  'R-22': (psig) => 0.9 * psig - 10,
  'R-410A': (psig) => 0.5 * psig + 5,
};
