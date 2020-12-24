import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { CustomLoggerService } from './shared/modules/custom-logger/custom-logger.service';

async function bootstrap() {
  CustomLoggerService.initWinston();

  const app = await NestFactory.create(AppModule, {
    logger: new CustomLoggerService()
  });

  const configService = app.get<ConfigService>(ConfigService);

  // Add prefix
  app.setGlobalPrefix('api/v1');

  // Add validation to all module controller
  app.useGlobalPipes(new ValidationPipe());

  // Setup Swagger
  const options = new DocumentBuilder()
    .setTitle('Imaginato API Documentation')
    .setDescription('List of available APIs')
    .setVersion('1.0')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  const port = configService.get<number>('common.port');

  await app.listen(port);

  console.log('Nest is listening on port ' + port);
}
bootstrap();
