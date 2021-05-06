import { Module, Global } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';

import { PIGPIO_SERVICE_TOKEN, PIGPIO_TOKEN } from './pigpio.constants';

import { PigpioService } from './pigpio.service';


@Global()
@Module({

  imports: [ ConfigModule ],

  providers: [
    {
      provide   : PIGPIO_TOKEN,
      useFactory: () => ({})
    },
    {
      provide : PIGPIO_SERVICE_TOKEN,
      useClass: PigpioService
    }
  ],

  exports: [ PIGPIO_TOKEN, PIGPIO_SERVICE_TOKEN ]

})
export class PigpioHostModule {
}
