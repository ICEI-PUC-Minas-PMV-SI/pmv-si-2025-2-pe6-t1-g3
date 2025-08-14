import {
  Body,
  Controller,
  Delete,
  Get,
  Put,
  Post,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';

import { AuthGuard } from 'src/auth/auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { Public } from 'src/auth/decorators/public.decorator';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { ProdutoService } from './produto.service';
import { CreateProductDto, UpdateProductDto } from './dto/produto.dto';

@Controller('produto')
@ApiTags('Produto')
export class ProdutoController {
  constructor(private readonly produtoService: ProdutoService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Post('cadastrar')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Cadastrar novo produto (Admin apenas)' })
  @ApiResponse({ status: 201, description: 'Produto criado com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 403, description: 'Permissões insuficientes' })
  @HttpCode(HttpStatus.CREATED)
  cadastrar(@Body() body: CreateProductDto) {
    return this.produtoService.cadastrar(body);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Put('atualizar')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar produto (Admin apenas)' })
  @ApiResponse({ status: 200, description: 'Produto atualizado com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 403, description: 'Permissões insuficientes' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  atualizar(@Body() body: UpdateProductDto) {
    return this.produtoService.atualizar(body);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete('remover')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remover produto (Admin apenas)' })
  @ApiResponse({ status: 200, description: 'Produto removido com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({ status: 403, description: 'Permissões insuficientes' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  remover(@Body() body: { CODPROD: number }) {
    return this.produtoService.remover(body);
  }

  @Public()
  @Get('buscar')
  @ApiOperation({ summary: 'Buscar produto por ID' })
  @ApiResponse({ status: 200, description: 'Produto encontrado' })
  @ApiResponse({ status: 404, description: 'Produto não encontrado' })
  buscar(@Query('CODPROD', ParseIntPipe) CODPROD: number) {
    return this.produtoService.buscar({ CODPROD });
  }

  @Public()
  @Get('listar')
  @ApiOperation({ summary: 'Listar produtos' })
  @ApiResponse({ status: 200, description: 'Lista de produtos' })
  listar(@Query('CATEGORIA') categoria?: string) {
    return this.produtoService.listar({ CATEGORIA: categoria });
  }
}
