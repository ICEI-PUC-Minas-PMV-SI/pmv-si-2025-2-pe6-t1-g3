import {
  Body,
  Controller,
  Get,
  Patch,
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
import { PessoaService } from './pessoa.service';
import { BuscarPessoaDto } from './dto/buscar-pessoa.dto';

@Controller('pessoa')
@ApiTags('Pessoa')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class PessoaController {
  constructor(private readonly pessoaService: PessoaService) {}

  @Patch('/atualizar')
  @ApiOperation({
    summary: 'Atualizar dados do usuário',
    description:
      'Atualiza as informações do usuário autenticado. Permite modificar dados pessoais como nome, email, telefone, etc.',
    operationId: 'updateUser',
    security: [{ bearerAuth: [] }],
  })
  @ApiBody({
    schema: {
      type: 'object',
      required: ['CODPES'],
      properties: {
        CODPES: { type: 'number', example: 1 },
        EMAIL: { type: 'string', example: 'usuario@exemplo.com' },
        NOME: { type: 'string', example: 'João' },
        SOBRENOME: { type: 'string', example: 'Silva' },
        CPF: { type: 'string', example: '12345678900' },
        TELEFONE: { type: 'string', example: '11987654321' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Usuário atualizado com sucesso',
    schema: {
      type: 'object',
      properties: {
        CODPES: { type: 'number', example: 1 },
        NOME: { type: 'string', example: 'João' },
        SOBRENOME: { type: 'string', example: 'Silva' },
        CPF: { type: 'string', example: '12345678900' },
        TELEFONE: { type: 'string', example: '11987654321' },
        CODUSU: { type: 'number', example: 1 },
        USUARIO: {
          type: 'object',
          properties: {
            CODUSU: { type: 'number', example: 1 },
            EMAIL: { type: 'string', example: 'usuario@exemplo.com' },
            PERMISSAO: { type: 'string', example: 'CLIENTE' },
          },
        },
        ENDERECOS: {
          type: 'array',
          items: {
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
              PRINCIPAL: { type: 'boolean', example: true },
            },
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
        message: { type: 'string', example: 'Email já cadastrado' },
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
  atualizar(@Body() body: any) {
    return this.pessoaService.atualizar(body);
  }

  @Get('/buscar')
  @ApiOperation({
    summary: 'Buscar usuário por ID',
    description:
      'Retorna os dados de um usuário específico. Requer autenticação e só permite acessar os próprios dados ou, para admins, dados de qualquer usuário.',
    operationId: 'findUserById',
    security: [{ bearerAuth: [] }],
  })
  @ApiQuery({
    name: 'CODPES',
    type: 'number',
    required: true,
    example: 1,
    description: 'ID do usuário a ser buscado',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Usuário encontrado',
    schema: {
      type: 'object',
      properties: {
        CODPES: { type: 'number', example: 1 },
        NOME: { type: 'string', example: 'João' },
        SOBRENOME: { type: 'string', example: 'Silva' },
        CPF: { type: 'string', example: '12345678900' },
        TELEFONE: { type: 'string', example: '11987654321' },
        CODUSU: { type: 'number', example: 1 },
        USUARIO: {
          type: 'object',
          properties: {
            CODUSU: { type: 'number', example: 1 },
            EMAIL: { type: 'string', example: 'usuario@exemplo.com' },
            PERMISSAO: { type: 'string', example: 'CLIENTE' },
          },
        },
        ENDERECOS: {
          type: 'array',
          items: {
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
              PRINCIPAL: { type: 'boolean', example: true },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Usuário não encontrado',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Usuário não encontrado' },
        error: { type: 'string', example: 'Not Found' },
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
  buscar(@Query() body: BuscarPessoaDto) {
    return this.pessoaService.buscar(body);
  }
}
