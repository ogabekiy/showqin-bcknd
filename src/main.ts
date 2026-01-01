import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);


  const config = new DocumentBuilder()
    .setTitle('Showqin API')
    .setDescription('The Showqin API description')
    .setVersion('1.0')
    .addTag('showqin')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads',
  });

  app.enableCors({
    origin: (origin, callback) => {
      callback(null, true);
    },
    credentials: true,
  })

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );

  console.log(`Application is running on: ${process.env.PORT ?? 3000}`);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
