import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';

import { ApiModule } from './api/api.module';
import { PigpioModule } from './pigpio/pigpio.module';
import { ConfigModule } from './config/config.module';
import { WeatherModule } from './weather/weather.module';


@Module({

  imports: [
    /** Main API Module */
    ApiModule,

    /** Pigpio Module to Talk with Raspberry PI */
    PigpioModule.forRoot({
      mock: process.env.NODE_ENV !== 'production'
    }),

    /** Config Module, to load/save settings */
    ConfigModule,

    /** Init the Scheduler */
    ScheduleModule.forRoot(),

    /** Set the the Weather Module */
    WeatherModule
  ]

})
export class AppModule {
}
