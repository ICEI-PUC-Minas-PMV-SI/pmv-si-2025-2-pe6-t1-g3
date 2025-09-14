import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { AuthService } from '../../src/auth/auth.service';
import { PrismaService } from '../../src/services/prisma.service';
import { EnderecoService } from '../../src/endereco/endereco.service';
import { createMockPrismaService, mockUser } from '../utils/test-utils';

// Mock bcrypt
jest.mock('bcryptjs');
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe('AuthService', () => {
  let service: AuthService;
  let prismaService: ReturnType<typeof createMockPrismaService>;
  let enderecoService: jest.Mocked<EnderecoService>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(async () => {
    const mockPrismaService = createMockPrismaService();
    const mockEnderecoService = {
      cadastrar: jest.fn(),
    };
    const mockJwtService = {
      signAsync: jest.fn(),
      verifyAsync: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
        {
          provide: EnderecoService,
          useValue: mockEnderecoService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prismaService = module.get(PrismaService);
    enderecoService = module.get(EnderecoService);
    jwtService = module.get(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    const loginDto = {
      EMAIL: 'test@example.com',
      SENHA: 'password123',
    };

    it('should login successfully with valid credentials', async () => {
      // Arrange
      const hashedPassword = '$2a$12$hashedpassword';
      const mockUserWithPassword = { ...mockUser, SENHA: hashedPassword };
      const mockToken = 'jwt-token';

      prismaService.login.findFirst.mockResolvedValue(mockUserWithPassword);
      mockedBcrypt.compare.mockResolvedValue(true);
      jwtService.signAsync.mockResolvedValue(mockToken);

      // Act
      const result = await service.login(loginDto);

      // Assert
      expect(prismaService.login.findFirst).toHaveBeenCalledWith({
        where: { EMAIL: loginDto.EMAIL.toLowerCase() },
        include: { PESSOA: true },
      });
      expect(mockedBcrypt.compare).toHaveBeenCalledWith(loginDto.SENHA, hashedPassword);
      expect(jwtService.signAsync).toHaveBeenCalled();
      expect(result).toEqual({
        token: mockToken,
        user: {
          id: mockUser.CODUSU,
          email: mockUser.EMAIL,
          permission: mockUser.PERMISSAO,
          profile: {
            id: mockUser.PESSOA.CODPES,
            name: mockUser.PESSOA.NOME,
            lastName: mockUser.PESSOA.SOBRENOME,
            phone: mockUser.PESSOA.TELEFONE,
            cpf: mockUser.PESSOA.CPF,
          },
        },
      });
    });

    it('should throw UNAUTHORIZED when user is not found', async () => {
      // Arrange
      prismaService.login.findFirst.mockResolvedValue(null);

      // Act & Assert
      await expect(service.login(loginDto)).rejects.toThrow(
        new HttpException('Credenciais inválidas', HttpStatus.UNAUTHORIZED)
      );
    });

    it('should throw UNAUTHORIZED when password is invalid', async () => {
      // Arrange
      const hashedPassword = '$2a$12$hashedpassword';
      const mockUserWithPassword = { ...mockUser, SENHA: hashedPassword };

      prismaService.login.findFirst.mockResolvedValue(mockUserWithPassword);
      mockedBcrypt.compare.mockResolvedValue(false);

      // Act & Assert
      await expect(service.login(loginDto)).rejects.toThrow(
        new HttpException('Credenciais inválidas', HttpStatus.UNAUTHORIZED)
      );
    });

    it('should handle internal server error', async () => {
      // Arrange
      prismaService.login.findFirst.mockRejectedValue(new Error('Database error'));

      // Act & Assert
      await expect(service.login(loginDto)).rejects.toThrow(
        new HttpException('Erro interno do servidor', HttpStatus.INTERNAL_SERVER_ERROR)
      );
    });
  });

  describe('registro', () => {
    const registroDto = {
      EMAIL: 'newuser@example.com',
      SENHA: 'password123',
      NOME: 'João',
      SOBRENOME: 'Silva',
      CPF: '12345678900',
      TELEFONE: '11987654321',
      ENDERECO: {
        CODPES: 1,
        DESCRICAO: 'Casa',
        CEP: '12345678',
        RUA: 'Rua das Flores',
        NUMERO: '123',
        COMPLEMENTO: 'Apto 42',
        BAIRRO: 'Centro',
        CIDADE: 'São Paulo',
      },
    };

    it('should register user successfully', async () => {
      // Arrange
      const hashedPassword = '$2a$12$hashedpassword';
      const newUser = { CODUSU: 2, EMAIL: registroDto.EMAIL, PERMISSAO: 'CLIENTE' };
      const newProfile = { CODPES: 2, ...registroDto, CODUSU: 2 };

      prismaService.login.findFirst.mockResolvedValue(null);
      mockedBcrypt.hash.mockResolvedValue(hashedPassword);
      prismaService.login.create.mockResolvedValue(newUser);
      prismaService.pessoa.create.mockResolvedValue(newProfile);

      // Act
      const result = await service.registro(registroDto);

      // Assert
      expect(prismaService.login.findFirst).toHaveBeenCalledWith({
        where: { EMAIL: registroDto.EMAIL.toLowerCase() },
      });
      expect(mockedBcrypt.hash).toHaveBeenCalledWith(registroDto.SENHA, 12);
      expect(prismaService.login.create).toHaveBeenCalledWith({
        data: {
          EMAIL: registroDto.EMAIL.toLowerCase(),
          SENHA: hashedPassword,
          PERMISSAO: 'CLIENTE',
        },
      });
      expect(prismaService.pessoa.create).toHaveBeenCalledWith({
        data: {
          NOME: registroDto.NOME.trim(),
          SOBRENOME: registroDto.SOBRENOME.trim(),
          CPF: registroDto.CPF.replace(/\D/g, ''),
          CODUSU: newUser.CODUSU,
          TELEFONE: registroDto.TELEFONE.replace(/\D/g, ''),
        },
      });
      expect(result).toEqual({
        id: newUser.CODUSU,
        email: newUser.EMAIL,
        permission: newUser.PERMISSAO,
      });
    });

    it('should throw CONFLICT when email already exists', async () => {
      // Arrange
      prismaService.login.findFirst.mockResolvedValue(mockUser);

      // Act & Assert
      await expect(service.registro(registroDto)).rejects.toThrow(
        new HttpException('Email já está em uso', HttpStatus.CONFLICT)
      );
    });
  });

  describe('changePassword', () => {
    const changePasswordDto = {
      userId: 1,
      oldPassword: 'oldpassword',
      newPassword: 'newpassword123',
    };

    it('should change password successfully', async () => {
      // Arrange
      const hashedOldPassword = '$2a$12$hashedoldpassword';
      const hashedNewPassword = '$2a$12$hashednewpassword';
      const user = { ...mockUser, SENHA: hashedOldPassword };
      const updatedUser = { ...user, SENHA: hashedNewPassword };

      prismaService.login.findUnique.mockResolvedValue(user);
      mockedBcrypt.compare.mockResolvedValue(true);
      mockedBcrypt.hash.mockResolvedValue(hashedNewPassword);
      prismaService.login.update.mockResolvedValue(updatedUser);

      // Act
      const result = await service.changePassword(
        changePasswordDto.userId,
        changePasswordDto.oldPassword,
        changePasswordDto.newPassword
      );

      // Assert
      expect(prismaService.login.findUnique).toHaveBeenCalledWith({
        where: { CODUSU: changePasswordDto.userId },
      });
      expect(mockedBcrypt.compare).toHaveBeenCalledWith(
        changePasswordDto.oldPassword,
        hashedOldPassword
      );
      expect(mockedBcrypt.hash).toHaveBeenCalledWith(changePasswordDto.newPassword, 12);
      expect(prismaService.login.update).toHaveBeenCalledWith({
        where: { CODUSU: changePasswordDto.userId },
        data: { SENHA: hashedNewPassword },
      });
      expect(result).toEqual(updatedUser);
    });

    it('should throw NOT_FOUND when user is not found', async () => {
      // Arrange
      prismaService.login.findUnique.mockResolvedValue(null);

      // Act & Assert
      await expect(
        service.changePassword(
          changePasswordDto.userId,
          changePasswordDto.oldPassword,
          changePasswordDto.newPassword
        )
      ).rejects.toThrow(
        new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND)
      );
    });

    it('should throw UNAUTHORIZED when old password is incorrect', async () => {
      // Arrange
      const hashedOldPassword = '$2a$12$hashedoldpassword';
      const user = { ...mockUser, SENHA: hashedOldPassword };

      prismaService.login.findUnique.mockResolvedValue(user);
      mockedBcrypt.compare.mockResolvedValue(false);

      // Act & Assert
      await expect(
        service.changePassword(
          changePasswordDto.userId,
          changePasswordDto.oldPassword,
          changePasswordDto.newPassword
        )
      ).rejects.toThrow(
        new HttpException('Senha atual incorreta', HttpStatus.UNAUTHORIZED)
      );
    });
  });

  describe('validateToken', () => {
    it('should validate token successfully', async () => {
      // Arrange
      const token = 'valid-jwt-token';
      const decodedToken = { sub: 1, email: 'test@example.com' };

      jwtService.verifyAsync.mockResolvedValue(decodedToken);

      // Act
      const result = await service.validateToken(token);

      // Assert
      expect(jwtService.verifyAsync).toHaveBeenCalledWith(token, {
        secret: process.env.JWT_SECRET || 'dev-secret-key-change-in-production',
      });
      expect(result).toEqual(decodedToken);
    });

    it('should throw UNAUTHORIZED when token is invalid', async () => {
      // Arrange
      const token = 'invalid-jwt-token';

      jwtService.verifyAsync.mockRejectedValue(new Error('Invalid token'));

      // Act & Assert
      await expect(service.validateToken(token)).rejects.toThrow(
        new HttpException('Token inválido', HttpStatus.UNAUTHORIZED)
      );
    });
  });
});
