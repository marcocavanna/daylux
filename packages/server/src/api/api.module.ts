import { Module } from '@nestjs/common';

import { PigpioModule } from '../pigpio/pigpio.module';

import { SystemController } from './system/system.controller';


@Module({

  imports: [ PigpioModule ],

  controllers: [ SystemController ]

})
export class ApiModule {
}
