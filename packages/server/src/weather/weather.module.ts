import { Module } from '@nestjs/common';

import { ConfigModule } from '../config/config.module';

import { WeatherService } from './weather.service';


@Module({

  imports: [ ConfigModule ],

  exports: [ WeatherService ],

  providers: [ WeatherService ]

})
export class WeatherModule {
}
