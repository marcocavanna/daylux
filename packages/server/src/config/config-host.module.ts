import { Module, Global } from '@nestjs/common';

import { CONFIG_SERVICE_TOKEN, CONFIG_TOKEN } from './config.constants';

import { ConfigService } from './config.service';


@Global()
@Module({

  providers: [
    {
      provide   : CONFIG_TOKEN,
      useFactory: () => ({})
    },
    {
      provide : CONFIG_SERVICE_TOKEN,
      useClass: ConfigService
    }
  ],

  exports: [ CONFIG_TOKEN, CONFIG_SERVICE_TOKEN ]

})
export class ConfigHostModule {
}
