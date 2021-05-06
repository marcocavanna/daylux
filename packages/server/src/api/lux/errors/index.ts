import { InternalServerErrorException, Logger } from '@nestjs/common';


const logger = new Logger('LuxApiError');

export class LuxApiSetLuxInternalServerError extends InternalServerErrorException {
  constructor() {
    super(
      'lux/error-setting-lux',
      'An error occured while setting the new Lux'
    );

    logger.error(this, this.stack);
  }
}
