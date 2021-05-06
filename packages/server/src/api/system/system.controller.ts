import { BadRequestException, Body, Controller, Get, Patch, ValidationPipe } from '@nestjs/common';

import { ConfigService } from '../../config/config.service';
import { PigpioService } from '../../pigpio/pigpio.service';
import { WeatherService } from '../../weather/weather.service';

import { ValidatedConfigPatch } from './validators/config.validator';


@Controller('api/system')
export class SystemController {

  constructor(
    private readonly configService: ConfigService,
    private readonly pigpioService: PigpioService,
    private readonly weatherService: WeatherService
  ) {
  }


  @Get('/status')
  public getStatus() {
    return {
      config: this.configService.getAll(),
      lux   : this.pigpioService.getLux()
    };
  }


  @Patch('/config')
  public setConfig(
    @Body(ValidationPipe) patch: ValidatedConfigPatch
  ): any {
    /** Assert field is valid */
    try {
      this.configService.get(patch.field);
    }
    catch {
      throw new BadRequestException(
        'config/invalid-field',
        `Field ${patch.field} seems not to be a valid config field`
      );
    }

    /** Set the new value */
    this.configService.set(patch.field, patch.value);

    /** Return full Config */
    return this.configService.getAll();
  }


  @Get('/weather')
  public getWeatherData(): any {
    return this.weatherService.getWeatherData();
  }
}
