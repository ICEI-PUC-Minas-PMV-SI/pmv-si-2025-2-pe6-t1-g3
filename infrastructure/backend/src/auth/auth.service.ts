import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { LoginDto, RegistroDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { EnderecoService } from 'src/endereco/endereco.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly enderecoService: EnderecoService,
    private jwt: JwtService,
  ) {}

  async login(body: LoginDto) {
    try {
      const user = await this.prisma.login.findFirst({
        where: { EMAIL: body.EMAIL.toLowerCase() },
        include: { PESSOA: true },
      });

      if (!user) {
        throw new HttpException(
          'Credenciais inválidas',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const isPasswordValid = await bcrypt.compare(body.SENHA, user.SENHA);
      if (!isPasswordValid) {
        throw new HttpException(
          'Credenciais inválidas',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const token = await this.generateToken({
        CODUSU: user.CODUSU,
        EMAIL: user.EMAIL,
        PERMISSAO: user.PERMISSAO,
        CODPES: user.PESSOA?.CODPES,
        NOME: user.PESSOA?.NOME,
        SOBRENOME: user.PESSOA?.SOBRENOME,
        TELEFONE: user.PESSOA?.TELEFONE,
        CPF: user.PESSOA?.CPF,
      });

      return {
        token,
        user: {
          id: user.CODUSU,
          email: user.EMAIL,
          permission: user.PERMISSAO,
          profile: user.PESSOA
            ? {
                id: user.PESSOA.CODPES,
                name: user.PESSOA.NOME,
                lastName: user.PESSOA.SOBRENOME,
                phone: user.PESSOA.TELEFONE,
                cpf: user.PESSOA.CPF,
              }
            : null,
        },
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Erro interno do servidor',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async changePassword(
    userId: number,
    oldPassword: string,
    newPassword: string,
  ) {
    try {
      const user = await this.prisma.login.findUnique({
        where: { CODUSU: userId },
      });

      if (!user) {
        throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
      }

      const isOldPasswordValid = await bcrypt.compare(oldPassword, user.SENHA);
      if (!isOldPasswordValid) {
        throw new HttpException(
          'Senha atual incorreta',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const hashedNewPassword = await bcrypt.hash(newPassword, 12);

      return await this.prisma.login.update({
        where: { CODUSU: userId },
        data: { SENHA: hashedNewPassword },
      });
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Erro interno do servidor',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async registro(body: RegistroDto) {
    try {
      // Normalize email
      const email = body.EMAIL.toLowerCase();

      const existingUser = await this.prisma.login.findFirst({
        where: { EMAIL: email },
      });

      if (existingUser) {
        throw new HttpException('Email já está em uso', HttpStatus.CONFLICT);
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(body.SENHA, 12);

      // Create user
      const newUser = await this.prisma.login.create({
        data: {
          EMAIL: email,
          SENHA: hashedPassword,
          PERMISSAO: 'CLIENTE',
        },
      });

      // Create profile
      const newProfile = await this.prisma.pessoa.create({
        data: {
          NOME: body.NOME.trim(),
          SOBRENOME: body.SOBRENOME.trim(),
          CPF: body.CPF.replace(/\D/g, ''), // Remove non-numeric characters
          CODUSU: newUser.CODUSU,
          TELEFONE: body.TELEFONE.replace(/\D/g, ''),
        },
      });

      if (body.ENDERECO) {
        await this.enderecoService.cadastrar({
          CODPES: newProfile.CODPES,
          DESCRICAO: body.ENDERECO.DESCRICAO,
          BAIRRO: body.ENDERECO.BAIRRO,
          CEP: body.ENDERECO.CEP,
          CIDADE: body.ENDERECO.CIDADE,
          COMPLEMENTO: body.ENDERECO.COMPLEMENTO,
          NUMERO: body.ENDERECO.NUMERO,
          RUA: body.ENDERECO.RUA,
        });
      }
      // Return user without password
      return {
        id: newUser.CODUSU,
        email: newUser.EMAIL,
        permission: newUser.PERMISSAO,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        'Erro interno do servidor',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  private async generateToken(payload: {
    CODUSU: number;
    EMAIL: string;
    PERMISSAO: string;
    CODPES?: number;
    NOME?: string;
    SOBRENOME?: string;
    CPF?: string;
    TELEFONE?: string;
  }) {
    // Don't include sensitive data in JWT
    const tokenPayload = {
      sub: payload.CODUSU,
      email: payload.EMAIL,
      PERMISSAO: payload.PERMISSAO,
      CODUSU: payload.CODUSU,
      CODPES: payload.CODPES,
      NOME: payload.NOME,
      SOBRENOME: payload.SOBRENOME,
      TELEFONE: payload.TELEFONE,
      CPF: payload.CPF,
    };

    return await this.jwt.signAsync(tokenPayload, {
      expiresIn: '24h',
      secret: process.env.JWT_SECRET || 'dev-secret-key-change-in-production',
    });
  }

  async validateToken(token: string) {
    try {
      const decoded = await this.jwt.verifyAsync(token, {
        secret: process.env.JWT_SECRET || 'dev-secret-key-change-in-production',
      });
      return decoded;
    } catch (error) {
      throw new HttpException('Token inválido', HttpStatus.UNAUTHORIZED);
    }
  }
}
