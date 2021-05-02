import { Config } from 'daylux-interfaces';


export const defaultConfig: Config = {
  autoLux      : false,
  dutyCycle    : {
    duration : 10_000,
    intensity: 100
  },
  lastLux      : null,
  location     : {
    latitude : null,
    longitude: null
  },
  weatherAPIKey: null,
  PINS         : {
    cold: 21,
    warm: 20
  }
};
