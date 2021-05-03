import { Module, DynamicModule, Provider } from '@nestjs/common';

import { ConfigService } from '../config/config.service';

import { PIGPIO_SERVICE_TOKEN } from './pigpio.constants';

import { PigpioHostModule } from './pigpio-host.module';
import { PigpioService } from './pigpio.service';

import { PigpioFactory } from './interfaces';


@Module({

  imports: [ PigpioHostModule ],

  providers: [
    {
      provide    : PigpioService,
      useExisting: PIGPIO_SERVICE_TOKEN
    }
  ],

  exports: [ PigpioHostModule, PigpioService ]

})
export class PigpioModule {

  static forRoot(options?: PigpioFactory): DynamicModule {

    const pigpioServiceProvider: Provider = {
      provide   : PigpioService,
      useFactory: async (pigpioService: PigpioService) => {
        return pigpioService.initConnector(options);
      },
      inject    : [ PIGPIO_SERVICE_TOKEN, ConfigService ]
    };

    return {
      module   : PigpioModule,
      global   : true,
      providers: [ pigpioServiceProvider ],
      exports  : [ PigpioService ]
    };
  }

}
