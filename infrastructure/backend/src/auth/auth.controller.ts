import {
  Body,
  Controller,
  Post,
  Req,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto, RegistroDto, ChangePasswordDto } from './dto/login.dto';
import { Public } from './decorators/public.decorator';
import { AuthGuard } from './auth.guard';
import { Request } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiBody,
} from '@nestjs/swagger';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Autenticar usuário',
    description: 'Realiza o login do usuário e retorna um token JWT',
    operationId: 'login',
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Login realizado com sucesso',
    schema: {
      type: 'object',
      properties: {
        token: { type: 'string', example: 'eyJhbGciOiJIUzI1NiIs...' },
        user: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            email: { type: 'string', example: 'usuario@exemplo.com' },
            permission: { type: 'string', example: 'CLIENTE' },
            profile: {
              type: 'object',
              properties: {
                id: { type: 'number', example: 1 },
                name: { type: 'string', example: 'João' },
                lastName: { type: 'string', example: 'Silva' },
                phone: { type: 'string', example: '11987654321' },
                cpf: { type: 'string', example: '12345678900' },
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Credenciais inválidas',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Credenciais inválidas' },
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
  login(@Body() body: LoginDto) {
    return this.authService.login(body);
  }

  @Public()
  @Post('registro')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Registrar novo usuário',
    description: 'Cria uma nova conta de usuário no sistema',
    operationId: 'register',
  })
  @ApiBody({
    type: RegistroDto,
    examples: {
      withAddress: {
        summary: 'Registro com endereço',
        value: {
          EMAIL: 'usuario@exemplo.com',
          SENHA: 'Senha@123',
          NOME: 'João',
          SOBRENOME: 'Silva',
          CPF: '12345678900',
          TELEFONE: '11987654321',
          ENDERECO: {
            DESCRICAO: 'Casa',
            CEP: '12345678',
            RUA: 'Rua das Flores',
            NUMERO: '123',
            COMPLEMENTO: 'Apto 42',
            BAIRRO: 'Centro',
            CIDADE: 'São Paulo',
          },
        },
      },
      withoutAddress: {
        summary: 'Registro sem endereço',
        value: {
          EMAIL: 'usuario@exemplo.com',
          SENHA: 'Senha@123',
          NOME: 'João',
          SOBRENOME: 'Silva',
          CPF: '12345678900',
          TELEFONE: '11987654321',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Usuário criado com sucesso',
    schema: {
      type: 'object',
      properties: {
        id: { type: 'number', example: 1 },
        email: { type: 'string', example: 'usuario@exemplo.com' },
        permission: { type: 'string', example: 'CLIENTE' },
        profile: {
          type: 'object',
          properties: {
            id: { type: 'number', example: 1 },
            name: { type: 'string', example: 'João' },
            lastName: { type: 'string', example: 'Silva' },
            phone: { type: 'string', example: '11987654321' },
            cpf: { type: 'string', example: '12345678900' },
            address: {
              type: 'object',
              properties: {
                id: { type: 'number', example: 1 },
                description: { type: 'string', example: 'Casa' },
                zipCode: { type: 'string', example: '12345678' },
                street: { type: 'string', example: 'Rua das Flores' },
                number: { type: 'string', example: '123' },
                complement: { type: 'string', example: 'Apto 42' },
                neighborhood: { type: 'string', example: 'Centro' },
                city: { type: 'string', example: 'São Paulo' },
                isMain: { type: 'boolean', example: true },
              },
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
        message: { type: 'string', example: 'Email inválido' },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Email já está em uso',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 409 },
        message: { type: 'string', example: 'Email já está em uso' },
        error: { type: 'string', example: 'Conflict' },
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
  register(@Body() body: RegistroDto) {
    return this.authService.registro(body);
  }

  @UseGuards(AuthGuard)
  @Post('change-password')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Alterar senha',
    description: 'Permite que o usuário altere sua senha atual',
    operationId: 'changePassword',
    security: [{ bearerAuth: [] }],
  })
  @ApiBody({ type: ChangePasswordDto })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Senha alterada com sucesso',
    schema: {
      type: 'object',
      properties: {
        CODUSU: { type: 'number', example: 1 },
        EMAIL: { type: 'string', example: 'usuario@exemplo.com' },
        PERMISSAO: { type: 'string', example: 'CLIENTE' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Senha atual incorreta ou token inválido',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Senha atual incorreta' },
        error: { type: 'string', example: 'Unauthorized' },
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
  changePassword(@Body() body: ChangePasswordDto, @Req() req: Request) {
    const userId = req['userId'];
    return this.authService.changePassword(
      userId,
      body.oldPassword,
      body.newPassword,
    );
  }

  @UseGuards(AuthGuard)
  @Post('validate-token')
  @HttpCode(HttpStatus.OK)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Validar token JWT',
    description:
      'Verifica se o token JWT atual é válido e retorna os dados do usuário',
    operationId: 'validateToken',
    security: [{ bearerAuth: [] }],
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Token válido',
    schema: {
      type: 'object',
      properties: {
        sub: { type: 'number', example: 1 },
        email: { type: 'string', example: 'usuario@exemplo.com' },
        PERMISSAO: { type: 'string', example: 'CLIENTE' },
        CODUSU: { type: 'number', example: 1 },
        CODPES: { type: 'number', example: 1 },
        NOME: { type: 'string', example: 'João' },
        SOBRENOME: { type: 'string', example: 'Silva' },
        TELEFONE: { type: 'string', example: '11987654321' },
        CPF: { type: 'string', example: '12345678900' },
        iat: { type: 'number', example: 1694613600 },
        exp: { type: 'number', example: 1694700000 },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Token inválido ou expirado',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 401 },
        message: { type: 'string', example: 'Token inválido' },
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
  validateToken(@Req() req: Request) {
    return {
      valid: true,
      user: req['user'],
    };
  }
}
