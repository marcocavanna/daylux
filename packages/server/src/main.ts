import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

import helmet from 'helmet';
import compression from 'compression';

import { AppModule } from './app.module';


async function bootstrap() {

  /** Create the App */
  const app = await NestFactory.create(AppModule);

  /** Enable Validation Pipe auto transform */
  app.useGlobalPipes(new ValidationPipe({
    transform: true
  }));

  /** Enable base CORS Options */
  app.enableCors();

  /** Apply basic Server Protection */
  app.use(helmet());
  app.use(compression());

  /** Listen */
  await app.listen(8001);
}

bootstrap();
