import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

import helmet from 'helmet';
import compression from 'compression';

import { AppModule } from './app.module';

import * as pkg from '../package.json';


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

  /** Set Swagger Documentation */
  const config = new DocumentBuilder()
    .setTitle('DayLux API')
    .setDescription('Manage DayLux device')
    .setVersion(pkg.version)
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document);

  /** Listen */
  await app.listen(8000);
}

bootstrap();
