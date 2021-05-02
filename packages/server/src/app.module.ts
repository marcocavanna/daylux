import { Module } from '@nestjs/common';

import { ApiModule } from './api/api.module';
import { PigpioModule } from './pigpio/pigpio.module';
import { ConfigModule } from './config/config.module';


@Module({

  imports: [
    /** Main API Module */
    ApiModule,

    /** Pigpio Module to Talk with Raspberry PI */
    PigpioModule.forRoot({
      mock: process.env.NODE_ENV !== 'production'
    }),

    /** Config Module, to load/save settings */
    ConfigModule.forRoot()
  ]

})
export class AppModule {
}
