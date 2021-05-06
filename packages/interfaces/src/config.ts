import { Lux } from './lux';
import { WeatherCondition } from './weather';


export interface Config {
  /** Is AutoLUX Enabled */
  autoLux: boolean;

  /** PWM Transition */
  dutyCycle: {
    /** Set duration of transition in seconds, 0 to disable */
    duration: number;

    /** Animation Frame Duration, default is 16 */
    frameDuration: number;

    /** Default intensity */
    intensity: number;

    /** Max Lux Temperature */
    maxTemperature: number;

    /** Lower Lux Temperature */
    minTemperature: number;

    /** Default PWM Range */
    pwmRange: number;
  };

  /** Intensity Params */
  intensity: {
    /** Weather dependent break down */
    breakdown: Record<WeatherCondition, number>

    /** Intensity on Midday */
    midday: number,

    /** Intensity on Sunrise */
    sunrise: number,

    /** How much time before sunrise the daylux must weak up, in minutes */
    sunriseOffset: number;

    /** Intensity on Sunset */
    sunset: number

    /** How much time after sunset the daylux must weak up, in minutes */
    sunsetOffset: number;
  },

  /** Last set Lux */
  lastLux: Lux | null;

  /** Current Location */
  location: {
    /** Place latitude */
    latitude: number | null;

    /** Place longitude */
    longitude: number | null;
  };

  /** Temperature Params */
  temperature: {
    /** Overridden Temperature by Weather Conditions */
    override: Record<WeatherCondition, number | null>;

    /** Maximum exponent for PolyOut function (refer to longest day) */
    maxPolyOutExponent: number;

    /** Temperature on Midday */
    midday: number;

    /** Minimum exponent for PolyOut function (refer to smaller day) */
    minPolyOutExponent: number;

    /** Temperature on Sunrise */
    sunriseOrSunset: number;
  },

  /** Open Weather Map API Key */
  weatherAPIKey: string | null;

  /** Save PIN Number */
  PINS: {
    /** Cold white PIN */
    cold: number;

    /** Warm white PIN */
    warm: number;
  };
}
