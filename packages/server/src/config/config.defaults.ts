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
    midday       : 100,
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
      CLOUDS            : 5250,
      DRIZZLE           : 5500,
      FEW_CLOUDS        : null,
      HEAVY_RAIN        : 5500,
      HEAVY_THUNDERSTORM: 5500,
      MIST              : 5500,
      OVERCAST_CLOUDS   : 5500,
      RAIN              : 5500,
      SNOW              : 5500,
      THUNDERSTORM      : 5500
    },
    maxPolyOutExponent: 6,
    midday            : 4700,
    minPolyOutExponent: 3,
    sunriseOrSunset   : 3000
  },
  weatherAPIKey: null,
  PINS         : {
    cold: 21,
    warm: 20
  }
};
