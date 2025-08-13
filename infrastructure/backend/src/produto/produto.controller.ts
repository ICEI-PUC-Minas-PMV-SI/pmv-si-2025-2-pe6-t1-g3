import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';

import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ProdutoService } from './produto.service';

@Controller('produto')
@ApiTags('Produto')
@ApiBearerAuth()
export class ProdutoController {
  constructor(private readonly produtoService: ProdutoService) {}

  @UseGuards(AuthGuard)
  @Post('/cadastrar')
  cadastrar(@Body() body: any) {
    return this.produtoService.cadastrar(body);
  }

  @UseGuards(AuthGuard)
  @Patch('/atualizar')
  atualizar(@Body() body: any) {
    return this.produtoService.atualizar(body);
  }

  @UseGuards(AuthGuard)
  @Delete('/deletar')
  deletar(@Query() body: any) {
    return this.produtoService.remover(body);
  }

  @Get('/buscar')
  buscar(@Query() body: any) {
    return this.produtoService.buscar(body);
  }

  @Get('/listar')
  listar(@Query() body: any) {
    return this.produtoService.listar(body);
  }
}
