import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthController } from './auth/auth.controller';
import { AuthService } from './auth/auth.service';
import { PrismaService } from './services/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { EnderecoService } from './endereco/endereco.service';
import { PessoaService } from './pessoa/pessoa.service';
import { ProdutoService } from './produto/produto.service';
import { PessoaController } from './pessoa/pessoa.controller';
import { EnderecoController } from './endereco/endereco.controller';
import { ProdutoController } from './produto/produto.controller';
import { PedidoController } from './pedido/pedido.controller';
import { PedidoService } from './pedido/pedido.service';

@Module({
  imports: [],
  controllers: [
    AppController,
    AuthController,
    PessoaController,
    EnderecoController,
    ProdutoController,
    PedidoController,
  ],
  providers: [
    AppService,
    AuthService,
    PrismaService,
    JwtService,
    EnderecoService,
    PessoaService,
    ProdutoService,
    PedidoService,
  ],
})
export class AppModule {}
