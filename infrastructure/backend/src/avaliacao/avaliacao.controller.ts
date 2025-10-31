import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  ParseIntPipe,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { AuthGuard } from 'src/auth/auth.guard';
import { Public } from 'src/auth/decorators/public.decorator';
import { AvaliacaoService } from './avaliacao.service';
import { CreateAvaliacaoDto } from './dto/avaliacao.dto';

@Controller('avaliacao')
@ApiTags('Avaliação')
export class AvaliacaoController {
  constructor(private readonly avaliacaoService: AvaliacaoService) {}

  @UseGuards(AuthGuard)
  @Post('criar')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Criar avaliação de produto',
    description:
      'Permite que um usuário autenticado avalie um produto que ele comprou. A nota é obrigatória (1-5 estrelas) e o comentário é opcional.',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Avaliação criada com sucesso',
    schema: {
      type: 'object',
      properties: {
        CODAVA: { type: 'number', example: 1 },
        NOTA: { type: 'number', example: 5 },
        COMENTARIO: {
          type: 'string',
          example: 'Excelente produto!',
        },
        CODPROD: { type: 'number', example: 1 },
        CODPES: { type: 'number', example: 1 },
        DATAINC: { type: 'string', example: '2025-10-30T23:00:00.000Z' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Usuário não comprou o produto',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Usuário já avaliou este produto',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Produto ou usuário não encontrado',
  })
  @HttpCode(HttpStatus.CREATED)
  criar(@Request() req, @Body() body: CreateAvaliacaoDto) {
    return this.avaliacaoService.criar(req.userId, body);
  }

  @Public()
  @Get('listar')
  @ApiOperation({
    summary: 'Listar avaliações de um produto',
    description:
      'Retorna todas as avaliações de um produto específico com estatísticas (média de notas e total de avaliações). Endpoint público.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de avaliações',
    schema: {
      type: 'object',
      properties: {
        avaliacoes: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              CODAVA: { type: 'number', example: 1 },
              NOTA: { type: 'number', example: 5 },
              COMENTARIO: {
                type: 'string',
                example: 'Excelente produto!',
              },
              DATAINC: { type: 'string', example: '2025-10-30T23:00:00.000Z' },
              PESSOA: {
                type: 'object',
                properties: {
                  NOME: { type: 'string', example: 'João' },
                  SOBRENOME: { type: 'string', example: 'Silva' },
                },
              },
            },
          },
        },
        estatisticas: {
          type: 'object',
          properties: {
            total: { type: 'number', example: 10 },
            mediaNotas: { type: 'number', example: 4.5 },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Produto não encontrado',
  })
  listar(@Query('CODPROD', ParseIntPipe) CODPROD: number) {
    return this.avaliacaoService.listar(CODPROD);
  }

  @UseGuards(AuthGuard)
  @Get('verificar-compra')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Verificar se usuário pode avaliar produto',
    description:
      'Verifica se o usuário autenticado comprou o produto e se já avaliou.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Status de compra e avaliação',
    schema: {
      type: 'object',
      properties: {
        comprou: { type: 'boolean', example: true },
        jaAvaliou: { type: 'boolean', example: false },
      },
    },
  })
  verificarCompra(
    @Request() req,
    @Query('CODPROD', ParseIntPipe) CODPROD: number,
  ) {
    return this.avaliacaoService.verificarSeComprouProduto(req.userId, CODPROD);
  }
}
