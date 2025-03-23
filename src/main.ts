import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as packageJson from '../package.json';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './filters/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new AllExceptionsFilter());

  const host = process.env.HOST || 'localhost';
  const apiUrl = host === 'localhost' ? 'http://localhost:3002' : 'http://localhost:3000/task';


  const config = new DocumentBuilder()
    .setTitle(packageJson.name)
    .setDescription(packageJson.description)
    .setVersion(packageJson.version)
    .addServer(apiUrl)
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3002);
}
bootstrap();
