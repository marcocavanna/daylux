import { Config } from 'daylux-interfaces';


export const defaultConfig: Config = {
  autoLux      : false,
  dutyCycle    : {
    duration      : 10_000,
    frameDuration : 16,
    intensity     : 100,
    maxTemperature: 6000,
    minTemperature: 3000,
    pwmRange      : 3000
  },
  intensity    : {
    breakdown    : {
      CLEAR             : 1,
      CLOUDS            : 0.9,
      DRIZZLE           : 0.8,
      FEW_CLOUDS        : 0.95,
      HEAVY_RAIN        : 0.75,
      HEAVY_THUNDERSTORM: 0.5,
      MIST              : 0.8,
      OVERCAST_CLOUDS   : 0.9,
      RAIN              : 0.8,
      SNOW              : 0.8,
      THUNDERSTORM      : 0.7
    },
    midday       : 95,
    sunrise      : 5,
    sunriseOffset: 20,
    sunset       : 5,
    sunsetOffset : 20
  },
  lastLux      : null,
  location     : {
    latitude : null,
    longitude: null
  },
  temperature  : {
    override          : {
      CLEAR             : null,
      CLOUDS            : 5750,
      DRIZZLE           : 6000,
      FEW_CLOUDS        : null,
      HEAVY_RAIN        : 6000,
      HEAVY_THUNDERSTORM: 6000,
      MIST              : 6000,
      OVERCAST_CLOUDS   : 6000,
      RAIN              : 6000,
      SNOW              : 6000,
      THUNDERSTORM      : 6000
    },
    maxPolyOutExponent: 5,
    midday            : 5750,
    minPolyOutExponent: 2,
    sunriseOrSunset   : 3000
  },
  weatherAPIKey: null,
  PINS         : {
    cold: 21,
    warm: 20
  }
};
