export interface Lux {
  /** Boost intensity will set the highest PWM Value, value between 0 and 1 */
  boostIntensity?: number;

  /** Animation duration */
  duration?: number;

  /** Kelvin temperature to Set */
  kelvin: number;

  /** Intensity to Set */
  intensity: number;
}
