import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NotAcceptableException, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.APP_PORT || 4000;
  app.enableCors({
    allowedHeaders: ['authorization'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    optionsSuccessStatus: 200,
    origin: (reqOrigin, cb) => {
      const allowedOrigins = process.env.CROS_ORIGINS
        ? process.env.CORS_ORIGINS?.split(',')
        : ['*'];

      if (allowedOrigins?.includes(reqOrigin) || allowedOrigins?.includes('*'))
        return cb(null, reqOrigin);
      else
        cb(
          new NotAcceptableException(
            `${reqOrigin}'❌`,
          ),
        );
    },
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  await app.listen(port, () => {
    console.log(`http://localhost:${port}`);
  });
}
bootstrap();
