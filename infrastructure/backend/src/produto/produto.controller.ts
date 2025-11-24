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
  @ApiOperation({
    summary: 'Cadastrar novo produto (Admin apenas)',
    description:
      'Cadastra um novo produto no sistema. Requer permissão de administrador. Valida todos os campos e gera um código único para o produto.',
    operationId: 'createProduct',
    security: [{ bearerAuth: [] }],
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Produto criado com sucesso',
    schema: {
      type: 'object',
      properties: {
        CODPROD: { type: 'number', example: 1 },
        PRODUTO: { type: 'string', example: 'Camiseta Polo' },
        DESCRICAO: {
          type: 'string',
          example: 'Camiseta polo masculina 100% algodão',
        },
        VALOR: { type: 'number', example: 29.99 },
        ESTOQUE: { type: 'number', example: 50 },
        CODCAT: { type: 'number', example: 1 },
        IMAGEM: { type: 'string', example: 'https://exemplo.com/imagem.jpg' },
        DESCONTO: { type: 'number', example: 0 },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Não autorizado',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Não autorizado' },
        error: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Permissões insuficientes',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 403 },
        message: {
          type: 'string',
          example: 'Usuário não tem permissão de administrador',
        },
        error: { type: 'string', example: 'Forbidden' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Dados inválidos',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'string', example: 'Valor não pode ser negativo' },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Erro interno do servidor',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 500 },
        message: { type: 'string', example: 'Erro interno do servidor' },
        error: { type: 'string', example: 'Internal Server Error' },
      },
    },
  })
  @HttpCode(HttpStatus.CREATED)
  cadastrar(@Body() body: CreateProductDto) {
    return this.produtoService.cadastrar(body);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Put('atualizar')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Atualizar produto (Admin apenas)',
    description:
      'Atualiza as informações de um produto existente. Requer permissão de administrador. Permite modificar todos os campos exceto o código do produto.',
    operationId: 'updateProduct',
    security: [{ bearerAuth: [] }],
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Produto atualizado com sucesso',
    schema: {
      type: 'object',
      properties: {
        CODPROD: { type: 'number', example: 1 },
        PRODUTO: { type: 'string', example: 'Camiseta Polo' },
        DESCRICAO: {
          type: 'string',
          example: 'Camiseta polo masculina 100% algodão',
        },
        VALOR: { type: 'number', example: 29.99 },
        ESTOQUE: { type: 'number', example: 50 },
        CODCAT: { type: 'number', example: 1 },
        IMAGEM: { type: 'string', example: 'https://exemplo.com/imagem.jpg' },
        DESCONTO: { type: 'number', example: 0 },
            FORNECEDOR: {
              type: 'object',
              properties: {
                CODUSU: { type: 'number', example: 2 },
                EMAIL: { type: 'string', example: 'fornecedor@exemplo.com' },
                PESSOA: {
                  type: 'object',
                  properties: {
                    NOME: { type: 'string', example: 'Fornecedor' },
                    SOBRENOME: { type: 'string', example: 'Exemplo' },
                    TELEFONE: { type: 'string', example: '11988887777' },
                  },
                },
              },
            },
        CATEGORIAS: {
          type: 'object',
          properties: {
            CODCAT: { type: 'number', example: 1 },
            CATEGORIA: { type: 'string', example: 'MASCULINO' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Não autorizado',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Não autorizado' },
        error: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Permissões insuficientes',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 403 },
        message: {
          type: 'string',
          example: 'Usuário não tem permissão de administrador',
        },
        error: { type: 'string', example: 'Forbidden' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Produto não encontrado',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Produto não encontrado' },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Dados inválidos',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'string', example: 'Valor não pode ser negativo' },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Erro interno do servidor',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 500 },
        message: { type: 'string', example: 'Erro interno do servidor' },
        error: { type: 'string', example: 'Internal Server Error' },
      },
    },
  })
  atualizar(@Body() body: UpdateProductDto) {
    return this.produtoService.atualizar(body);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  @Delete('remover')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Remover produto (Admin apenas)',
    description:
      'Remove um produto do sistema. Requer permissão de administrador. Só é possível remover produtos que não estejam em nenhum pedido.',
    operationId: 'deleteProduct',
    security: [{ bearerAuth: [] }],
  })
  @ApiResponse({
    status: 200,
    description: 'Produto removido com sucesso',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string', example: 'Produto removido com sucesso' },
        CODPROD: { type: 'number', example: 1 },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Não autorizado',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Não autorizado' },
        error: { type: 'string', example: 'Unauthorized' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: 'Permissões insuficientes',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 403 },
        message: {
          type: 'string',
          example: 'Usuário não tem permissão de administrador',
        },
        error: { type: 'string', example: 'Forbidden' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Produto não encontrado',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Produto não encontrado' },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Produto em uso',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: {
          type: 'string',
          example: 'Produto está associado a pedidos',
        },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Erro interno do servidor',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 500 },
        message: { type: 'string', example: 'Erro interno do servidor' },
        error: { type: 'string', example: 'Internal Server Error' },
      },
    },
  })
  remover(@Query('CODPROD', ParseIntPipe) CODPROD: number) {
    return this.produtoService.remover({ CODPROD });
  }

  @Public()
  @Get('buscar')
  @ApiOperation({
    summary: 'Buscar produto por ID',
    description:
      'Retorna os detalhes completos de um produto específico. Endpoint público que não requer autenticação.',
    operationId: 'findProductById',
  })
  @ApiResponse({
    status: 200,
    description: 'Produto encontrado',
    schema: {
      type: 'object',
      properties: {
        CODPROD: { type: 'number', example: 1 },
        PRODUTO: { type: 'string', example: 'Camiseta Polo' },
        DESCRICAO: {
          type: 'string',
          example: 'Camiseta polo masculina 100% algodão',
        },
        VALOR: { type: 'number', example: 29.99 },
        ESTOQUE: { type: 'number', example: 50 },
        CODCAT: { type: 'number', example: 1 },
        IMAGEM: { type: 'string', example: 'https://exemplo.com/imagem.jpg' },
        DESCONTO: { type: 'number', example: 0 },
        CATEGORIAS: {
          type: 'object',
          properties: {
            CODCAT: { type: 'number', example: 1 },
            CATEGORIA: { type: 'string', example: 'MASCULINO' },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Produto não encontrado',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Produto não encontrado' },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.INTERNAL_SERVER_ERROR,
    description: 'Erro interno do servidor',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 500 },
        message: { type: 'string', example: 'Erro interno do servidor' },
        error: { type: 'string', example: 'Internal Server Error' },
      },
    },
  })
  buscar(@Query('CODPROD', ParseIntPipe) CODPROD: number) {
    return this.produtoService.buscar({ CODPROD });
  }

  @Public()
  @Get('listar')
  @ApiOperation({
    summary: 'Listar produtos',
    description:
      'Retorna a lista de todos os produtos disponíveis. Permite filtrar por categoria. Endpoint público que não requer autenticação.',
    operationId: 'listProducts',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de produtos',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          CODPROD: { type: 'number', example: 1 },
          PRODUTO: { type: 'string', example: 'Camiseta Polo' },
          DESCRICAO: {
            type: 'string',
            example: 'Camiseta polo masculina 100% algodão',
          },
          VALOR: { type: 'number', example: 29.99 },
          ESTOQUE: { type: 'number', example: 50 },
          CODCAT: { type: 'number', example: 1 },
          IMAGEM: { type: 'string', example: 'https://exemplo.com/imagem.jpg' },
          DESCONTO: { type: 'number', example: 0 },
              FORNECEDOR: {
                type: 'object',
                properties: {
                  CODUSU: { type: 'number', example: 2 },
                  EMAIL: { type: 'string', example: 'fornecedor@exemplo.com' },
                  PESSOA: {
                    type: 'object',
                    properties: {
                      NOME: { type: 'string', example: 'Fornecedor' },
                      SOBRENOME: { type: 'string', example: 'Exemplo' },
                      TELEFONE: { type: 'string', example: '11988887777' },
                    },
                  },
                },
              },
          CATEGORIAS: {
            type: 'object',
            properties: {
              CODCAT: { type: 'number', example: 1 },
              CATEGORIA: { type: 'string', example: 'MASCULINO' },
            },
          },
        },
      },
    },
  })
  listar(@Query('CATEGORIA') categoria?: string) {
    return this.produtoService.listar({ CATEGORIA: categoria });
  }
}
