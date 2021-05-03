// eslint-disable-next-line max-classes-per-file
import { InternalServerErrorException, Logger } from '@nestjs/common';


const errorLogger = new Logger('PigpioError');

export class GpioModuleNotLoadedException extends InternalServerErrorException {
  constructor() {
    super(
      'pigpio/module-not-loaded',
      'Gpio Load promise has been resolved but no module could be found'
    );

    errorLogger.error(this, this.stack);
  }
}

export class GpioDynamicModuleImportException extends InternalServerErrorException {
  constructor() {
    super(
      'pigpio/loading-pigpio-module-error',
      'An error occurred while dynamically load the correct Gpio Module'
    );

    errorLogger.error(this, this.stack);
  }
}
