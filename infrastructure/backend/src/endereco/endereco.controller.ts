import {
  Body,
  Controller,
  Delete,
  Patch,
  Post,
  Query,
  UseGuards,
  HttpStatus,
} from '@nestjs/common';
import { EnderecoService } from './endereco.service';
import { AuthGuard } from 'src/auth/auth.guard';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { CadatrarEnderecoDto } from './dto/cadastrar-endereco.dto';
import { AtualizarEnderecoDto } from './dto/atualizar-endereco.dto';

@Controller('endereco')
@ApiTags('Endereco')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class EnderecoController {
  constructor(private readonly enderecoService: EnderecoService) {}

  @Post('/cadastrar')
  @ApiOperation({
    summary: 'Cadastrar novo endereço',
    description:
      'Cadastra um novo endereço para o usuário autenticado. O endereço será validado e o CEP será verificado antes do cadastro.',
    operationId: 'createAddress',
    security: [{ bearerAuth: [] }],
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: [
        'CODPES',
        'CEP',
        'RUA',
        'NUMERO',
        'BAIRRO',
        'CIDADE',
        'DESCRICAO',
      ],
      properties: {
        CODPES: { type: 'number', example: 1 },
        CEP: { type: 'string', example: '12345678' },
        RUA: { type: 'string', example: 'Rua das Flores' },
        NUMERO: { type: 'string', example: '123' },
        COMPLEMENTO: { type: 'string', example: 'Apto 42' },
        BAIRRO: { type: 'string', example: 'Centro' },
        CIDADE: { type: 'string', example: 'São Paulo' },
        DESCRICAO: { type: 'string', example: 'Casa' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Endereço cadastrado com sucesso',
    schema: {
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
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Dados inválidos',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'string', example: 'CEP inválido' },
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
  cadastrar(@Body() body: CadatrarEnderecoDto) {
    return this.enderecoService.cadastrar(body);
  }

  @Patch('/atualizar')
  @ApiOperation({
    summary: 'Atualizar endereço',
    description:
      'Atualiza um endereço existente do usuário. Permite modificar qualquer informação do endereço, exceto o ID do usuário associado.',
    operationId: 'updateAddress',
    security: [{ bearerAuth: [] }],
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['CODEND'],
      properties: {
        CODEND: { type: 'number', example: 1 },
        CEP: { type: 'string', example: '12345678' },
        RUA: { type: 'string', example: 'Rua das Flores' },
        NUMERO: { type: 'string', example: '123' },
        COMPLEMENTO: { type: 'string', example: 'Apto 42' },
        BAIRRO: { type: 'string', example: 'Centro' },
        CIDADE: { type: 'string', example: 'São Paulo' },
        DESCRICAO: { type: 'string', example: 'Casa' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Endereço atualizado com sucesso',
    schema: {
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
    description: 'Endereço não encontrado',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Endereço não encontrado' },
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
        message: { type: 'string', example: 'CEP inválido' },
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
  atualizar(@Body() body: AtualizarEnderecoDto) {
    return this.enderecoService.atualizar(body);
  }

  @Delete('/deletar')
  @ApiOperation({
    summary: 'Deletar endereço',
    description:
      'Remove um endereço do usuário. O endereço só pode ser removido se não estiver associado a nenhum pedido em andamento.',
    operationId: 'deleteAddress',
    security: [{ bearerAuth: [] }],
  })
  @ApiQuery({
    name: 'CODEND',
    type: 'number',
    required: true,
    example: 1,
    description: 'ID do endereço a ser removido',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Endereço removido com sucesso',
    schema: {
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
    description: 'Endereço não encontrado',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Endereço não encontrado' },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Endereço em uso',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: {
          type: 'string',
          example: 'Endereço está associado a pedidos em andamento',
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
    return this.enderecoService.deletar(body);
  }
}
