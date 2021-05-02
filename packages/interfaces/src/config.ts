import { Lux } from './lux';


export interface Config {
  /** Is AutoLUX Enabled */
  autoLux: boolean;

  /** PWM Transition */
  dutyCycle: {
    /** Set duration of transition in seconds, 0 to disable */
    duration: number;

    /** Default intensity */
    intensity: number;
  };

  /** Last set Lux */
  lastLux: Lux | null;

  /** Current Location */
  location: {
    /** Place latitude */
    latitude: number | null;

    /** Place longitude */
    longitude: number | null;
  };

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
