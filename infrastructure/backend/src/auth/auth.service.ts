import { randomBytes } from 'crypto';
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';
import * as bcrypt from 'bcryptjs';
import { EnderecoService } from 'src/endereco/endereco.service';
import { PrismaService } from 'src/services/prisma.service';
import { GoogleLoginDto, LoginDto, RegistroDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  private readonly googleClient?: OAuth2Client;

  constructor(
    private readonly prisma: PrismaService,
    private readonly enderecoService: EnderecoService,
    private readonly jwt: JwtService,
  ) {
    if (process.env.GOOGLE_CLIENT_ID) {
      this.googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
    }
  }

  async login(body: LoginDto) {
    try {
      const user = await this.prisma.login.findFirst({
        where: { EMAIL: body.EMAIL.toLowerCase() },
        include: { PESSOA: true },
      });

      if (!user) {
        throw new HttpException(
          'Credenciais invalidas',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const isPasswordValid = await bcrypt.compare(body.SENHA, user.SENHA);
      if (!isPasswordValid) {
        throw new HttpException(
          'Credenciais invalidas',
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

  async loginWithGoogle(body: GoogleLoginDto) {
    if (!this.googleClient || !process.env.GOOGLE_CLIENT_ID) {
      throw new HttpException(
        'Login com Google nao esta configurado',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken: body.credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });

      const payload = ticket.getPayload();

      if (!payload || !payload.email) {
        throw new HttpException(
          'Token do Google invalido',
          HttpStatus.UNAUTHORIZED,
        );
      }

      if (payload.email_verified === false) {
        throw new HttpException(
          'Email do Google nao verificado',
          HttpStatus.UNAUTHORIZED,
        );
      }

      const email = payload.email.toLowerCase();

      let user = await this.prisma.login.findUnique({
        where: { EMAIL: email },
        include: { PESSOA: true },
      });

      if (!user) {
        const randomPassword = randomBytes(32).toString('hex');
        const hashedPassword = await bcrypt.hash(randomPassword, 12);

        const createdUser = await this.prisma.login.create({
          data: {
            EMAIL: email,
            SENHA: hashedPassword,
            PERMISSAO: 'CLIENTE',
          },
        });

        const firstName = (
          payload.given_name ||
          payload.name?.split(' ')?.[0] ||
          'Cliente'
        ).slice(0, 50);
        const lastName = (
          payload.family_name ||
          payload.name?.split(' ')?.slice(1).join(' ') ||
          'Google'
        ).slice(0, 50);

        try {
          await this.prisma.pessoa.create({
            data: {
              NOME: firstName,
              SOBRENOME: lastName,
              CPF: '00000000000',
              TELEFONE: '0000000000',
              CODUSU: createdUser.CODUSU,
            },
          });
        } catch {
          // Usuario podera complementar os dados depois
        }

        user = await this.prisma.login.findUnique({
          where: { EMAIL: email },
          include: { PESSOA: true },
        });

        if (!user) {
          throw new HttpException(
            'Nao foi possivel concluir o login com Google',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }
      }

      const token = await this.generateToken({
        CODUSU: user.CODUSU,
        EMAIL: user.EMAIL,
        PERMISSAO: user.PERMISSAO,
        CODPES: user.PESSOA?.CODPES,
        NOME: user.PESSOA?.NOME || payload.given_name || payload.name,
        SOBRENOME: user.PESSOA?.SOBRENOME || payload.family_name || '',
        TELEFONE: user.PESSOA?.TELEFONE,
        CPF: user.PESSOA?.CPF,
      });

      const profileFromDatabase = user.PESSOA
        ? {
            id: user.PESSOA.CODPES,
            name: user.PESSOA.NOME,
            lastName: user.PESSOA.SOBRENOME,
            phone: user.PESSOA.TELEFONE,
            cpf: user.PESSOA.CPF,
          }
        : null;

      const profileFromPayload = payload
        ? {
            id: null,
            name: payload.given_name || payload.name || '',
            lastName: payload.family_name || '',
            phone: null,
            cpf: null,
          }
        : null;

      return {
        token,
        user: {
          id: user.CODUSU,
          email: user.EMAIL,
          permission: user.PERMISSAO,
          profile: profileFromDatabase || profileFromPayload,
        },
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      throw new HttpException(
        'Nao foi possivel concluir o login com Google',
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
        throw new HttpException('Usuario nao encontrado', HttpStatus.NOT_FOUND);
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
      const email = body.EMAIL.toLowerCase();

      const existingUser = await this.prisma.login.findFirst({
        where: { EMAIL: email },
      });

      if (existingUser) {
        throw new HttpException('Email ja esta em uso', HttpStatus.CONFLICT);
      }

      const hashedPassword = await bcrypt.hash(body.SENHA, 12);

      // Allow requesting a role during registration but restrict to safe roles
      const requestedRole = (body as any).PERMISSAO
        ? String((body as any).PERMISSAO).toUpperCase()
        : 'CLIENTE';
      const allowedRoles = ['CLIENTE', 'FORNECEDOR'];
      const roleToAssign = allowedRoles.includes(requestedRole)
        ? requestedRole
        : 'CLIENTE';

      const newUser = await this.prisma.login.create({
        data: {
          EMAIL: email,
          SENHA: hashedPassword,
          PERMISSAO: roleToAssign,
        },
      });

      const newProfile = await this.prisma.pessoa.create({
        data: {
          NOME: body.NOME.trim(),
          SOBRENOME: body.SOBRENOME.trim(),
          CPF: body.CPF.replace(/\D/g, ''),
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
      throw new HttpException('Token invalido', HttpStatus.UNAUTHORIZED);
    }
  }
}
