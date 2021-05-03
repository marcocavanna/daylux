import { Body, Controller, Get, Post, ValidationPipe } from '@nestjs/common';

import { Lux } from 'daylux-interfaces';

import { PigpioService } from '../../pigpio/pigpio.service';

import { ValidatedLux } from './validators/lux.validator';


@Controller('api/lux')
export class LuxController {

  constructor(private readonly pigpioService: PigpioService) {
  }


  @Get()
  public getLux(): Lux {
    return this.pigpioService.getLux();
  }


  @Post()
  public setLux(
    @Body(ValidationPipe) lux: ValidatedLux
  ): void {
    this.pigpioService.setLux(lux);
  }

}
