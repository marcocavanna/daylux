export interface Lux {
  /** Boost intensity will set the highest PWM Value, value between 0 and 1 */
  boostIntensity?: number;

  /** Animation duration */
  duration?: number;

  /** Intensity to Set */
  intensity: number;

  /** Kelvin temperature to Set */
  temperature: number;
}
