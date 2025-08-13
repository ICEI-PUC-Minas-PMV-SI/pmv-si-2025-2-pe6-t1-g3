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
import { PedidoService } from './pedido.service';

@Controller('pedido')
@ApiTags('Pedido')
@ApiBearerAuth()
export class PedidoController {
  constructor(private readonly pedidoService: PedidoService) {}

  @UseGuards(AuthGuard)
  @Post('/cadastrar')
  cadastrar(@Body() body: any) {
    return this.pedidoService.cadastrar(body);
  }

  @UseGuards(AuthGuard)
  @Patch('/atualizar')
  atualizar(@Body() body: any) {
    return this.pedidoService.atualizar(body);
  }

  @UseGuards(AuthGuard)
  @Delete('/deletar')
  deletar(@Query() body: any) {
    return this.pedidoService.remover(body);
  }

  @UseGuards(AuthGuard)
  @Get('/buscar')
  buscar(@Query() body: any) {
    return this.pedidoService.buscar(body);
  }

  @UseGuards(AuthGuard)
  @Get('/listar')
  listar(@Query() body: any) {
    return this.pedidoService.listar(body);
  }
}
