import { Config } from 'daylux-interfaces';


export const defaultConfig: Config = {
  autoLux      : false,
  dutyCycle    : {
    duration      : 10_000,
    frameDuration : 16,
    intensity     : 100,
    maxTemperature: 6000,
    minTemperature: 3000,
    pwmRange      : 255
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
