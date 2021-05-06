import { BadRequestException, InternalServerErrorException } from '@nestjs/common';


export class WeatherAPINotFoundException extends BadRequestException {
  constructor() {
    super(
      'weather/api-not-found',
      'Invalid Weather API found'
    );
  }
}


export class InvalidLocationException extends BadRequestException {
  constructor() {
    super(
      'weather/invalid-location',
      'An invalid Longitude or Latitude has been found'
    );
  }
}


export class OpenWeatherMapException extends InternalServerErrorException {
  constructor() {
    super(
      'weather/open-weather-map-error',
      'An error occurred while performing API request to OpenWeather API'
    );
  }
}
