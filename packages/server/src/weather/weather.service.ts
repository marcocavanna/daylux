import { Injectable, Logger } from '@nestjs/common';

import axios from 'axios';

import { OpenWeatherMapResponse, WeatherLocation } from 'daylux-interfaces';

import { ConfigService } from '../config/config.service';
import { PigpioService } from '../pigpio/pigpio.service';

import { InvalidLocationException, OpenWeatherMapException, WeatherAPINotFoundException } from './errors';


@Injectable()
export class WeatherService {

  private logger: Logger = new Logger('WeatherService');


  constructor(
    private readonly configService: ConfigService,
    private readonly pigpioService: PigpioService
  ) {
    this.logger.verbose('Module Initialized');
  }


  public async getWeatherData(): Promise<any> {
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
      const response = await axios.get<OpenWeatherMapResponse>(
        'https://api.openweathermap.org/data/2.5/weather',
        {
          params: {
            lat  : latitude,
            lon  : longitude,
            appid: apiKey
          }
        }
      );

      return response;
    }
    catch (error) {
      throw new OpenWeatherMapException();
    }
  }

}
