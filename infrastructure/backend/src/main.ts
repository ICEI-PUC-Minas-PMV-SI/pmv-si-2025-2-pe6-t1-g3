import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import * as bodyParser from 'body-parser';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Security headers
  app.use(
    helmet({
      crossOriginEmbedderPolicy: false,
      contentSecurityPolicy: {
        directives: {
          imgSrc: [`'self'`, 'data:', 'validator.swagger.io', 'https:'],
          scriptSrc: [`'self'`, `https: 'unsafe-inline'`],
        },
      },
    }),
  );

  // CORS configuration
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  // Global validation pipe (already configured in AppModule, but kept for backup)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: (errors) => {
        const messages = errors
          .map((error) => Object.values(error.constraints || {}).join(', '))
          .join('; ');
        return new Error(messages);
      },
    }),
  );

  // Body parser with reasonable limits
  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

  // Swagger documentation
  const logger = new Logger('Store API');
  const config = new DocumentBuilder()
    .setTitle('Store E-commerce API')
    .setDescription('API para loja de e-commerce com painel administrativo')
    .setVersion('2.0')
    .addTag('auth', 'Endpoints de autenticação')
    .addBearerAuth({
      type: 'http',
      scheme: 'Bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'Token JWT para autenticação',
      in: 'header',
    })
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const port = process.env.PORT || 3000;
  await app.listen(port, () => {
    logger.log(`🚀 Backend running on http://localhost:${port}`);
    logger.log(
      `📚 API Documentation available at http://localhost:${port}/api`,
    );
    logger.log(`🗄️  Database Admin available at http://localhost:5555`);
  });
}

bootstrap().catch((error) => {
  console.error('Failed to start application:', error);
  process.exit(1);
});
