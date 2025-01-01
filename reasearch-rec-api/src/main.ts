import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { AppConfigService } from './config/config.service';
import { ExceptionsFilter } from './common/filters/exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const appConfigService = app.get(AppConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  app.useGlobalFilters(new ExceptionsFilter());

  app.setGlobalPrefix(appConfigService.apiPrefix);

  app.enableCors({
    origin: appConfigService.cors.origin,
    methods: appConfigService.cors.methods,
    allowedHeaders: appConfigService.cors.allowedHeaders,
    credentials: appConfigService.cors.credentials,
  });

  await app.listen(appConfigService.port);
  console.log(
    `Application is running on PORT: ${appConfigService.baseUrl}:${appConfigService.port}/${appConfigService.apiPrefix}`,
  );
}
bootstrap();
