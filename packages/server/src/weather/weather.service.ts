import { Injectable, Logger } from '@nestjs/common';

import axios from 'axios';
import dayjs from 'dayjs';
import isLeapYear from 'dayjs/plugin/isLeapYear';

import { easePolyOut } from 'd3-ease';

import { OpenWeatherMapData, DayluxWeatherData, Season, WeatherCondition } from 'daylux-interfaces';

import { ConfigService } from '../config/config.service';
import { PigpioService } from '../pigpio/pigpio.service';

import { clamp } from '../utils';

import { InvalidLocationException, OpenWeatherMapException, WeatherAPINotFoundException } from './errors';


dayjs.extend(isLeapYear);


@Injectable()
export class WeatherService {

  private logger: Logger = new Logger('WeatherService');


  constructor(
    private readonly configService: ConfigService,
    private readonly pigpioService: PigpioService
  ) {
    this.logger.verbose('Module Initialized');
  }


  public async getWeatherData(): Promise<DayluxWeatherData> {
    const apiKey = this.configService.get('weatherAPIKey');
    const {
      latitude,
      longitude
    } = this.configService.get('location');

    if (!apiKey) {
      throw new WeatherAPINotFoundException();
    }

    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      throw new InvalidLocationException();
    }

    try {
      const { data } = await axios.get<OpenWeatherMapData>(
        'https://api.openweathermap.org/data/2.5/weather',
        {
          params: {
            lat  : latitude,
            lon  : longitude,
            appid: apiKey,
            units: 'metric',
            lang : 'it'
          }
        }
      );


      // ----
      // Convert Timestamp into Dayjs Object
      // ----
      const sunriseTimestamp = data.sys.sunrise * 1000;
      const sunrise = dayjs(sunriseTimestamp);
      const sunsetTimestamp = data.sys.sunset * 1000;
      const sunset = dayjs(sunsetTimestamp);
      const timestamp = data.dt * 1000;
      const now = dayjs(timestamp);


      // ----
      // Get Season
      // ----
      let season: Season = 'WINTER';

      const springStart = dayjs(new Date(now.year(), 2, 21));
      const summerStart = dayjs(new Date(now.year(), 5, 21));
      const autumnStart = dayjs(new Date(now.year(), 8, 21));
      const winterStart = dayjs(new Date(now.year(), 11, 21));

      if (now.isAfter(springStart) && now.isBefore(summerStart.subtract(1, 'ms'))) {
        season = 'SPRING';
      }
      else if (now.isAfter(summerStart) && now.isBefore(autumnStart.subtract(1, 'ms'))) {
        season = 'SUMMER';
      }
      else if (now.isAfter(autumnStart) && now.isBefore(winterStart.subtract(1, 'ms'))) {
        season = 'AUTUMN';
      }


      // ----
      // Get Weather Conditions
      // ----
      const code = data.weather[0]?.id;
      let current: WeatherCondition = 'CLEAR';

      if (code) {
        if (code >= 200 && code < 300) {
          current = [ 200, 201, 210, 211 ].includes(code)
            ? 'THUNDERSTORM'
            : 'HEAVY_THUNDERSTORM';
        }
        else if (code >= 300 && code < 400) {
          current = 'DRIZZLE';
        }
        else if (code >= 500 && code < 600) {
          current = [ 500, 501, 511, 520 ].includes(code)
            ? 'RAIN'
            : 'HEAVY_RAIN';
        }
        else if (code >= 600 && code < 700) {
          current = 'SNOW';
        }
        else if (code >= 700 && code < 800) {
          current = 'MIST';
        }
        else if (code === 801) {
          current = 'FEW_CLOUDS';
        }
        else if (code === 802 || code === 803) {
          current = 'CLOUDS';
        }
        else if (code === 804) {
          current = 'OVERCAST_CLOUDS';
        }
      }


      // ----
      // Get Config
      // ----
      const {
        breakdown,
        sunrise: sunriseIntensity,
        sunriseOffset,
        midday: middayIntensity,
        sunset: sunsetIntensity,
        sunsetOffset
      } = this.configService.get('intensity');


      // ----
      // Get Time Data
      // ----
      const offsetSunrise = sunrise.subtract(sunriseOffset, 'minutes');
      const offsetSunriseTimestamp = offsetSunrise.valueOf();
      const offsetSunset = sunset.add(sunsetOffset, 'minutes');
      const offsetSunsetTimestamp = offsetSunset.valueOf();
      const midday = sunrise.add(offsetSunset.diff(offsetSunrise, 'seconds') / 2, 'seconds');
      const middayTimestamp = midday.valueOf();

      const isRisen = now.isAfter(offsetSunrise) && now.isBefore(offsetSunset);
      const isAfternoon = now.isAfter(midday);

      // Build normalized time, where 0 represent sunrise
      // 1 represent midday and 0 represent sunset
      const normalizedTimestamp = clamp(
        [ 0, 1 ],
        !isAfternoon
          ? ((timestamp - offsetSunriseTimestamp) / (middayTimestamp - offsetSunriseTimestamp))
          : (((timestamp - offsetSunsetTimestamp) / (sunsetTimestamp - offsetSunsetTimestamp)) * -1) + 1
      );


      // ----
      // Get Exponent For PolyOut Function
      // ----
      const longestDay = summerStart.clone();
      const daysToLongestDay = Math.abs(Math.round(longestDay.add(10, 'days').diff(now, 'days')));
      const exponentMultiplier = clamp([ 0, 1 ], (daysToLongestDay / (now.isLeapYear() ? 366 : 365) / 2));

      const {
        override: overriddenTemperature,
        maxPolyOutExponent,
        minPolyOutExponent,
        sunriseOrSunset: sunriseOrSunsetTemperature,
        midday         : middayTemperature
      } = this.configService.get('temperature');

      const {
        maxTemperature,
        minTemperature
      } = this.configService.get('dutyCycle');

      const polyOutExponent = minPolyOutExponent + ((maxPolyOutExponent - minPolyOutExponent) * exponentMultiplier);

      const polyOutFunction = easePolyOut.exponent(polyOutExponent);


      // ----
      // Normalize the Temperature and the Intensity
      // ----
      const luxMultiplier = polyOutFunction(normalizedTimestamp);

      let intensity = isRisen
        ? !isAfternoon
          ? clamp([ 0, 100 ], sunriseIntensity + (middayIntensity - sunriseIntensity) * luxMultiplier)
          : clamp([ 0, 100 ], sunsetIntensity + (middayIntensity - sunsetIntensity) * luxMultiplier)
        : 0;
      let temperature = sunriseOrSunsetTemperature + (middayTemperature - sunriseOrSunsetTemperature) * luxMultiplier;


      // ----
      // Adjusting data based on Weather
      // ----
      intensity *= breakdown[current];
      temperature = overriddenTemperature[current] ?? temperature;

      // ----
      // Return Weather Data
      // ----
      return {
        clouds          : data.clouds.all,
        current,
        location        : data.name,
        suggestedLux    : {
          intensity  : clamp([ 0, 100 ], Math.round(intensity)),
          temperature: clamp([ minTemperature, maxTemperature ], Math.round(temperature))
        },
        midday          : midday.valueOf(),
        season,
        sunrise         : sunrise.valueOf(),
        sunset          : sunset.valueOf(),
        temperature     : data.main.temp,
        temperatureFeels: data.main.feels_like,
        timestamp       : now.valueOf()
      };
    }
    catch (error) {
      throw new OpenWeatherMapException();
    }
  }

}
