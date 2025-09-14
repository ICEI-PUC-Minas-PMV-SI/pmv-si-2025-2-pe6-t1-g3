import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { AuthController } from '../../src/auth/auth.controller';
import { AuthService } from '../../src/auth/auth.service';
import { LoginDto, RegistroDto, ChangePasswordDto } from '../../src/auth/dto/login.dto';
import { CadastrarEnderecoDto } from '../../src/endereco/dto/endereco.dto';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: jest.Mocked<AuthService>;

  beforeEach(async () => {
    const mockAuthService = {
      login: jest.fn(),
      registro: jest.fn(),
      changePassword: jest.fn(),
      validateToken: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
            verify: jest.fn(),
          },
        },
        {
          provide: Reflector,
          useValue: {
            getAllAndOverride: jest.fn(),
            getAllAndMerge: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get(AuthService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('login', () => {
    const loginDto: LoginDto = {
      EMAIL: 'test@example.com',
      SENHA: 'password123',
    };

    it('should return token and user data on successful login', async () => {
      // Arrange
      const expectedResponse = {
        token: 'jwt-token',
        user: {
          id: 1,
          email: 'test@example.com',
          permission: 'CLIENTE',
          profile: {
            id: 1,
            name: 'João',
            lastName: 'Silva',
            phone: '11987654321',
            cpf: '12345678900',
          },
        },
      };

      authService.login.mockResolvedValue(expectedResponse);

      // Act
      const result = await controller.login(loginDto);

      // Assert
      expect(authService.login).toHaveBeenCalledWith(loginDto);
      expect(result).toEqual(expectedResponse);
    });

    it('should throw HttpException when login fails', async () => {
      // Arrange
      const error = new HttpException('Credenciais inválidas', HttpStatus.UNAUTHORIZED);
      authService.login.mockRejectedValue(error);

      // Act & Assert
      await expect(controller.login(loginDto)).rejects.toThrow(error);
    });
  });

  describe('register', () => {
    const registroDto: RegistroDto = {
      EMAIL: 'newuser@example.com',
      SENHA: 'password123',
      NOME: 'João',
      SOBRENOME: 'Silva',
      CPF: '12345678900',
      TELEFONE: '11987654321',
      ENDERECO: new CadastrarEnderecoDto()
    };

    it('should return user data on successful registration', async () => {
      // Arrange
      const expectedResponse = {
        id: 2,
        email: 'newuser@example.com',
        permission: 'CLIENTE',
      };

      authService.registro.mockResolvedValue(expectedResponse);

      // Act
      const result = await controller.register(registroDto);

      // Assert
      expect(authService.registro).toHaveBeenCalledWith(registroDto);
      expect(result).toEqual(expectedResponse);
    });

    it('should throw HttpException when registration fails', async () => {
      // Arrange
      const error = new HttpException('Email já está em uso', HttpStatus.CONFLICT);
      authService.registro.mockRejectedValue(error);

      // Act & Assert
      await expect(controller.register(registroDto)).rejects.toThrow(error);
    });
  });

  describe('changePassword', () => {
    const changePasswordDto: ChangePasswordDto = {
      oldPassword: 'oldpassword',
      newPassword: 'newpassword123',
    };

    const mockRequest = {
      userId: 1,
    } as any;

    it('should change password successfully', async () => {
      // Arrange
      const expectedResponse = {
        CODUSU: 1,
        EMAIL: 'test@example.com',
        PERMISSAO: 'CLIENTE',
        SENHA:'newpassword123',
        NOME: 'João',
        SOBRENOME: 'Silva',
        CPF: '12345678900',
        TELEFONE: '11987654321',
        ENDERECO: '11987654321'
      };

      authService.changePassword.mockResolvedValue(expectedResponse);

      // Act
      const result = await controller.changePassword(changePasswordDto, mockRequest);

      // Assert
      expect(authService.changePassword).toHaveBeenCalledWith(
        mockRequest.userId,
        changePasswordDto.oldPassword,
        changePasswordDto.newPassword
      );
      expect(result).toEqual(expectedResponse);
    });

    it('should throw HttpException when change password fails', async () => {
      // Arrange
      const error = new HttpException('Senha atual incorreta', HttpStatus.UNAUTHORIZED);
      authService.changePassword.mockRejectedValue(error);

      // Act & Assert
      await expect(
        controller.changePassword(changePasswordDto, mockRequest)
      ).rejects.toThrow(error);
    });
  });

  describe('validateToken', () => {
    const mockRequest = {
      user: {
        sub: 1,
        email: 'test@example.com',
        PERMISSAO: 'CLIENTE',
        CODUSU: 1,
        CODPES: 1,
        NOME: 'João',
        SOBRENOME: 'Silva',
        TELEFONE: '11987654321',
        CPF: '12345678900',
      },
    } as any;

    it('should return validation result with user data', async () => {
      // Act
      const result = await controller.validateToken(mockRequest);

      // Assert
      expect(result).toEqual({
        valid: true,
        user: mockRequest.user,
      });
    });
  });
});
