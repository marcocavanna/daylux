import { Injectable, Logger } from '@nestjs/common';

import type { Gpio } from 'pigpio';

import { Deferred } from '../utils/Deferred';

import { PigpioFactory } from './interfaces';


@Injectable()
export class PigpioService {

  /* --------
   * Gpio Connector Package
   * -------- */
  private Gpio: typeof Gpio | undefined;


  /* --------
   * Logger
   * -------- */
  private readonly logger: Logger = new Logger('PigpioService');


  /* --------
   * Service Constructor
   * -------- */
  constructor() {
    this.logger.verbose('Service Built');
  }


  /* --------
   * Connector Init
   * -------- */
  public async initConnector(options?: PigpioFactory): Promise<typeof Gpio> {
    /** If a connector already exists, return it */
    if (this.Gpio) {
      this.logger.verbose('A valid Gpio Constructor already exists.');
      return Promise.resolve(this.Gpio);
    }

    /** Init a Deferred load object */
    const initDefer = new Deferred<Gpio>();

    try {
      this.Gpio = await new Promise<typeof Gpio>((resolve) => {
        if (options?.mock) {
          this.logger.verbose('Loading MockModule');
          import('./lib/GpioMock').then((mockModule) => {
            return resolve(mockModule.GpioMock as any as typeof Gpio);
          });
        }
        else {
          this.logger.verbose('Loading main Gpio');
          import('pigpio').then((gpioModule) => {
            return resolve(gpioModule.Gpio);
          });
        }
      });

      this.logger.verbose('Connector Initialized');
      return this.Gpio;
    }
    catch (error) {
      this.logger.error('Error while loading Gpio Module');
      initDefer.reject(error);
      throw error;
    }
  }


  public getStatus() {
    return true;
  }
}
