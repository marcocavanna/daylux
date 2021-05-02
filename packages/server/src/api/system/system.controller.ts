import { Controller, Get } from '@nestjs/common';

import { PigpioService } from '../../pigpio/pigpio.service';


@Controller('api/system')
export class SystemController {

  constructor(private readonly pigpioService: PigpioService) {
  }


  @Get('status')
  public getStatus() {
    return this.pigpioService.getStatus();
  }
}
