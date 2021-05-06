import { Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';

import { WeatherModule } from '../weather/weather.module';

import { SystemController } from './system/system.controller';
import { LuxController } from './lux/lux.controller';


@Module({

  imports: [
    ConfigModule,
    WeatherModule
  ],

  controllers: [ SystemController, LuxController ]

})
export class ApiModule {
}
