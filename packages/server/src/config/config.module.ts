import { Module, DynamicModule } from '@nestjs/common';

import { CONFIG_SERVICE_TOKEN } from './config.constants';

import { ConfigHostModule } from './config-host.module';
import { ConfigService } from './config.service';


@Module({

  imports: [ ConfigHostModule ],

  providers: [
    {
      provide    : ConfigService,
      useExisting: CONFIG_SERVICE_TOKEN
    }
  ],

  exports: [ ConfigHostModule, ConfigService ]

})
export class ConfigModule {

  static forRoot(): DynamicModule {
    return {
      module   : ConfigModule,
      global   : true,
      providers: [
        {
          provide   : ConfigService,
          useFactory: (configServer: ConfigService) => configServer,
          inject    : [ CONFIG_SERVICE_TOKEN ]
        }
      ],
      exports  : [ ConfigService ]
    };
  }

}
