/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  const port = process.env.PORT || 3000;
  const config = new DocumentBuilder()
    .setTitle('DevDude API')
    .setDescription('The DevDude API description')
    .setVersion('1.0')
    .addTag('User')
    .addTag('Topic')
    .addTag('Category')
    .addTag('Question')
    .addTag('Attempt')
    .addTag('AttemptAnswer')
    .addTag('AssessmentTemplate')
    .addTag('AssessmentTemplateOption')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, documentFactory);

  await app.listen(port);
  Logger.log(
    `🚀 Application is running on: http://localhost:${port}/${globalPrefix}`
  );
}

bootstrap();
