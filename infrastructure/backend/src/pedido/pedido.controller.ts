import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Query,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';

import { AuthGuard } from 'src/auth/auth.guard';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { PedidoService } from './pedido.service';

@Controller('pedido')
@ApiTags('Pedido')
@ApiBearerAuth()
export class PedidoController {
  constructor(private readonly pedidoService: PedidoService) {}

  @UseGuards(AuthGuard)
  @Post('/cadastrar')
  @ApiOperation({
    summary: 'Criar novo pedido',
    description:
      'Cria um novo pedido para o usuário autenticado. Valida o estoque dos produtos, calcula o valor total e define o status inicial como PENDENTE.',
    operationId: 'createOrder',
    security: [{ bearerAuth: [] }],
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['CODPES', 'CODEND', 'ITENS'],
      properties: {
        CODPES: { type: 'number', example: 1 },
        CODEND: { type: 'number', example: 1 },
        ITENS: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              CODPROD: { type: 'number', example: 1 },
              QUANTIDADE: { type: 'number', example: 2 },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Pedido criado com sucesso',
    schema: {
      type: 'object',
      properties: {
        CODPED: { type: 'number', example: 1 },
        CODPES: { type: 'number', example: 1 },
        CODEND: { type: 'number', example: 1 },
        DESCONTO: { type: 'number', example: 10 },
        FRETE: { type: 'number', example: 15 },
        SUBTOTAL: { type: 'number', example: 299.99 },
        VALORTOTAL: { type: 'number', example: 304.99 },
        ITENSPEDIDO: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              CODPED: { type: 'number', example: 1 },
              CODPROD: { type: 'number', example: 1 },
              TAMANHO: { type: 'string', example: 'M' },
              QTD: { type: 'number', example: 2 },
            },
          },
        },
        ENDERECO: {
          type: 'object',
          properties: {
            CODEND: { type: 'number', example: 1 },
            CODPES: { type: 'number', example: 1 },
            DESCRICAO: { type: 'string', example: 'Casa' },
            CEP: { type: 'string', example: '12345678' },
            RUA: { type: 'string', example: 'Rua das Flores' },
            NUMERO: { type: 'string', example: '123' },
            COMPLEMENTO: { type: 'string', example: 'Apto 42' },
            BAIRRO: { type: 'string', example: 'Centro' },
            CIDADE: { type: 'string', example: 'São Paulo' },
          },
        },
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
        message: { type: 'string', example: 'Produto sem estoque suficiente' },
        error: { type: 'string', example: 'Bad Request' },
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
  cadastrar(@Body() body: any) {
    return this.pedidoService.cadastrar(body);
  }

  @UseGuards(AuthGuard)
  @Patch('/atualizar')
  @ApiOperation({
    summary: 'Atualizar pedido',
    description:
      'Atualiza o status de um pedido existente. A mudança de status segue um fluxo específico: PENDENTE → CONFIRMADO → EM_PREPARACAO → ENVIADO → ENTREGUE. O status CANCELADO só pode ser definido a partir de PENDENTE ou CONFIRMADO.',
    operationId: 'updateOrder',
    security: [{ bearerAuth: [] }],
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['CODPED', 'STATUS'],
      properties: {
        CODPED: { type: 'number', example: 1 },
        STATUS: {
          type: 'string',
          example: 'EM_PREPARACAO',
          enum: [
            'PENDENTE',
            'CONFIRMADO',
            'EM_PREPARACAO',
            'ENVIADO',
            'ENTREGUE',
            'CANCELADO',
          ],
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Pedido atualizado com sucesso',
    schema: {
      type: 'object',
      properties: {
        CODPED: { type: 'number', example: 1 },
        CODPES: { type: 'number', example: 1 },
        CODEND: { type: 'number', example: 1 },
        DESCONTO: { type: 'number', example: 10 },
        FRETE: { type: 'number', example: 15 },
        SUBTOTAL: { type: 'number', example: 299.99 },
        VALORTOTAL: { type: 'number', example: 304.99 },
        ITENSPEDIDO: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              CODPED: { type: 'number', example: 1 },
              CODPROD: { type: 'number', example: 1 },
              TAMANHO: { type: 'string', example: 'M' },
              QTD: { type: 'number', example: 2 },
            },
          },
        },
        ENDERECO: {
          type: 'object',
          properties: {
            CODEND: { type: 'number', example: 1 },
            CODPES: { type: 'number', example: 1 },
            DESCRICAO: { type: 'string', example: 'Casa' },
            CEP: { type: 'string', example: '12345678' },
            RUA: { type: 'string', example: 'Rua das Flores' },
            NUMERO: { type: 'string', example: '123' },
            COMPLEMENTO: { type: 'string', example: 'Apto 42' },
            BAIRRO: { type: 'string', example: 'Centro' },
            CIDADE: { type: 'string', example: 'São Paulo' },
          },
        },
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
        message: {
          type: 'string',
          example: 'Status inválido para o pedido atual',
        },
        error: { type: 'string', example: 'Bad Request' },
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
    status: HttpStatus.NOT_FOUND,
    description: 'Pedido não encontrado',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Pedido não encontrado' },
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
  atualizar(@Body() body: any) {
    return this.pedidoService.atualizar(body);
  }

  @UseGuards(AuthGuard)
  @Delete('/deletar')
  @ApiOperation({
    summary: 'Cancelar pedido',
    description:
      'Cancela um pedido existente. Só é possível cancelar pedidos com status PENDENTE ou CONFIRMADO. O cancelamento retorna os produtos ao estoque.',
    operationId: 'cancelOrder',
    security: [{ bearerAuth: [] }],
  })
  @ApiQuery({
    name: 'CODPED',
    type: 'number',
    required: true,
    example: 1,
    description: 'ID do pedido a ser cancelado',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Pedido cancelado com sucesso',
    schema: {
      type: 'object',
      properties: {
        CODPED: { type: 'number', example: 1 },
        CODPES: { type: 'number', example: 1 },
        CODEND: { type: 'number', example: 1 },
        DESCONTO: { type: 'number', example: 10 },
        FRETE: { type: 'number', example: 15 },
        SUBTOTAL: { type: 'number', example: 299.99 },
        VALORTOTAL: { type: 'number', example: 304.99 },
        ITENSPEDIDO: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              CODPED: { type: 'number', example: 1 },
              CODPROD: { type: 'number', example: 1 },
              TAMANHO: { type: 'string', example: 'M' },
              QTD: { type: 'number', example: 2 },
            },
          },
        },
        ENDERECO: {
          type: 'object',
          properties: {
            CODEND: { type: 'number', example: 1 },
            CODPES: { type: 'number', example: 1 },
            DESCRICAO: { type: 'string', example: 'Casa' },
            CEP: { type: 'string', example: '12345678' },
            RUA: { type: 'string', example: 'Rua das Flores' },
            NUMERO: { type: 'string', example: '123' },
            COMPLEMENTO: { type: 'string', example: 'Apto 42' },
            BAIRRO: { type: 'string', example: 'Centro' },
            CIDADE: { type: 'string', example: 'São Paulo' },
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
    status: HttpStatus.NOT_FOUND,
    description: 'Pedido não encontrado',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Pedido não encontrado' },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Pedido não pode ser cancelado',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: {
          type: 'string',
          example: 'Pedido não pode ser cancelado neste status',
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
  deletar(@Query() body: any) {
    return this.pedidoService.remover(body);
  }

  @UseGuards(AuthGuard)
  @Get('/buscar')
  @ApiOperation({
    summary: 'Buscar pedido por ID',
    description:
      'Retorna os detalhes completos de um pedido específico, incluindo itens, produtos, valores e endereço de entrega.',
    operationId: 'findOrderById',
    security: [{ bearerAuth: [] }],
  })
  @ApiQuery({
    name: 'CODPED',
    type: 'number',
    required: true,
    example: 1,
    description: 'ID do pedido a ser buscado',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Pedido encontrado',
    schema: {
      type: 'object',
      properties: {
        CODPED: { type: 'number', example: 1 },
        CODPES: { type: 'number', example: 1 },
        CODEND: { type: 'number', example: 1 },
        DESCONTO: { type: 'number', example: 10 },
        FRETE: { type: 'number', example: 15 },
        SUBTOTAL: { type: 'number', example: 299.99 },
        VALORTOTAL: { type: 'number', example: 304.99 },
        ITENSPEDIDO: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              CODPED: { type: 'number', example: 1 },
              CODPROD: { type: 'number', example: 1 },
              TAMANHO: { type: 'string', example: 'M' },
              QTD: { type: 'number', example: 2 },
            },
          },
        },
        ENDERECO: {
          type: 'object',
          properties: {
            CODEND: { type: 'number', example: 1 },
            CODPES: { type: 'number', example: 1 },
            DESCRICAO: { type: 'string', example: 'Casa' },
            CEP: { type: 'string', example: '12345678' },
            RUA: { type: 'string', example: 'Rua das Flores' },
            NUMERO: { type: 'string', example: '123' },
            COMPLEMENTO: { type: 'string', example: 'Apto 42' },
            BAIRRO: { type: 'string', example: 'Centro' },
            CIDADE: { type: 'string', example: 'São Paulo' },
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
    status: HttpStatus.NOT_FOUND,
    description: 'Pedido não encontrado',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Pedido não encontrado' },
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
  buscar(@Query() body: any) {
    return this.pedidoService.buscar(body);
  }

  @UseGuards(AuthGuard)
  @Get('/listar')
  @ApiOperation({
    summary: 'Listar pedidos',
    description:
      'Retorna a lista resumida de pedidos do usuário. Permite filtrar por status e ordenar por data. Retorna informações básicas como valor total, quantidade de itens e status.',
    operationId: 'listOrders',
    security: [{ bearerAuth: [] }],
  })
  @ApiQuery({
    name: 'CODPES',
    type: 'number',
    required: true,
    example: 1,
    description: 'ID do usuário para listar os pedidos',
  })
  @ApiQuery({
    name: 'STATUS',
    type: 'string',
    required: false,
    example: 'EM_PREPARACAO',
    enum: [
      'PENDENTE',
      'CONFIRMADO',
      'EM_PREPARACAO',
      'ENVIADO',
      'ENTREGUE',
      'CANCELADO',
    ],
    description: 'Filtrar pedidos por status',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lista de pedidos',
    schema: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          CODPED: { type: 'number', example: 1 },
          CODPES: { type: 'number', example: 1 },
          CODEND: { type: 'number', example: 1 },
          DESCONTO: { type: 'number', example: 10 },
          FRETE: { type: 'number', example: 15 },
          SUBTOTAL: { type: 'number', example: 299.99 },
          VALORTOTAL: { type: 'number', example: 304.99 },
          ITENSPEDIDO: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                CODPED: { type: 'number', example: 1 },
                CODPROD: { type: 'number', example: 1 },
                TAMANHO: { type: 'string', example: 'M' },
                QTD: { type: 'number', example: 2 },
              },
            },
          },
          ENDERECO: {
            type: 'object',
            properties: {
              CODEND: { type: 'number', example: 1 },
              CODPES: { type: 'number', example: 1 },
              DESCRICAO: { type: 'string', example: 'Casa' },
              CEP: { type: 'string', example: '12345678' },
              RUA: { type: 'string', example: 'Rua das Flores' },
              NUMERO: { type: 'string', example: '123' },
              COMPLEMENTO: { type: 'string', example: 'Apto 42' },
              BAIRRO: { type: 'string', example: 'Centro' },
              CIDADE: { type: 'string', example: 'São Paulo' },
            },
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
  listar(@Query() body: any) {
    return this.pedidoService.listar(body);
  }
}
