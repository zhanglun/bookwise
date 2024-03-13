import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { PrismaClientExceptionFilter } from './common/filters/prisma.filter';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  const configService: ConfigService = app.get(ConfigService);

  app.setGlobalPrefix('api');
  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaClientExceptionFilter());
  app.useGlobalFilters(new HttpExceptionFilter());

  await app.listen(configService.get('port'));
}

bootstrap();
