import { Body, Controller, Get, Post, Query, ValidationPipe } from '@nestjs/common';
import { ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';

import { Lux } from 'daylux-interfaces';

import { PigpioService } from '../../pigpio/pigpio.service';

import { LuxResponse } from '../../responses';

import { LuxApiSetLuxInternalServerError } from './errors';
import { ValidatedLux } from './validators/lux.validator';


@ApiTags('Lux')
@Controller('api/lux')
export class LuxController {

  constructor(private readonly pigpioService: PigpioService) {
  }


  @Get()
  @ApiResponse({ status: 200, description: 'Current Lux', type: LuxResponse })
  public getLux(): Lux {
    return this.pigpioService.getLux();
  }


  @Post()
  @ApiQuery({
    name       : 'wait',
    description: 'By default, this API will not wait the setLux promise. To receive the response once Lux has been changed, pass wait=true',
    required   : false,
    type       : Boolean
  })
  @ApiResponse({ status: 201, description: 'Current Lux, only when `wait=true`', type: LuxResponse })
  @ApiResponse({ status: 400, description: 'A validation error occurred, see response for details' })
  @ApiResponse({ status: 500, description: 'Error settings new Lux', type: LuxApiSetLuxInternalServerError })
  public async setLux(
    @Body(ValidationPipe)
      lux: ValidatedLux,
    @Query('wait')
      awaitForFinish?: boolean
  ): Promise<void | Lux> {
    const changeLuxPromise = this.pigpioService.setLux(lux);

    if (!awaitForFinish) {
      return;
    }

    try {
      return await changeLuxPromise;
    }
    catch {
      throw new LuxApiSetLuxInternalServerError();
    }
  }

}
