import { Module, ValidationPipe } from '@nestjs/common';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { AuthGuard } from './auth/auth.guard';
import { PrismaService } from './services/prisma.service';
import { EnderecoService } from './endereco/endereco.service';
import { PessoaService } from './pessoa/pessoa.service';
import { ProdutoService } from './produto/produto.service';
import { PessoaController } from './pessoa/pessoa.controller';
import { EnderecoController } from './endereco/endereco.controller';
import { ProdutoController } from './produto/produto.controller';
import { PedidoController } from './pedido/pedido.controller';
import { PedidoService } from './pedido/pedido.service';
import { HealthController } from './health/health.controller';
import { AvaliacaoController } from './avaliacao/avaliacao.controller';
import { AvaliacaoService } from './avaliacao/avaliacao.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'dev-secret-key-change-in-production',
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [
    AppController,
    AuthController,
    PessoaController,
    EnderecoController,
    ProdutoController,
    PedidoController,
    HealthController,
    AvaliacaoController,
  ],
  providers: [
    AppService,
    AuthService,
    PrismaService,
    EnderecoService,
    PessoaService,
    ProdutoService,
    PedidoService,
    AvaliacaoService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
      useValue: new ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
        exceptionFactory: (errors) => {
          const messages = errors
            .map((error) => Object.values(error.constraints || {}).join(', '))
            .join('; ');
          return new Error(messages);
        },
      }),
    },
  ],
})
export class AppModule {}
