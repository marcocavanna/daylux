type ClampFunction = ((range: [ min: number, max: number ], value: number) => number) & {
  factory: (range: [ number, number ]) => (value: number) => number
};

export const clamp: ClampFunction = (range, value) => {
  const [ min, max ] = range;
  return Math.max(Math.min(value, max), min);
};

clamp.factory = (range) => (value) => clamp(range, value);
