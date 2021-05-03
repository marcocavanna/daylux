import { Module } from '@nestjs/common';

import { PigpioModule } from '../pigpio/pigpio.module';

import { SystemController } from './system/system.controller';
import { LuxController } from './lux/lux.controller';


@Module({

  imports: [ PigpioModule ],

  controllers: [ SystemController, LuxController ]

})
export class ApiModule {
}
