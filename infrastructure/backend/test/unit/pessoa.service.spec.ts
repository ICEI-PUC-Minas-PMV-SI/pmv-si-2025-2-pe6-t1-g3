import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { PessoaService } from '../../src/pessoa/pessoa.service';
import { PrismaService } from '../../src/services/prisma.service';
import { createMockPrismaService, mockUser } from '../utils/test-utils';

describe('PessoaService', () => {
  let service: PessoaService;
  let prismaService: ReturnType<typeof createMockPrismaService>;

  beforeEach(async () => {
    const mockPrismaService = createMockPrismaService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PessoaService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<PessoaService>(PessoaService);
    prismaService = module.get(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('buscar', () => {
    const buscarDto = { CODPES: 1 };

    it('should return person data when found', async () => {
      // Arrange
      const mockPerson = {
        CODPES: 1,
        NOME: 'João',
        SOBRENOME: 'Silva',
        CPF: '12345678900',
        TELEFONE: '11987654321',
        CODUSU: 1,
        USUARIO: mockUser,
        ENDERECOS: [],
      };

      prismaService.pessoa.findFirst.mockResolvedValue(mockPerson);

      // Act
      const result = await service.buscar(buscarDto);

      // Assert
      expect(prismaService.pessoa.findFirst).toHaveBeenCalledWith({
        where: { CODPES: buscarDto.CODPES },
        include: { USUARIO: true, ENDERECOS: true },
      });
      expect(result).toEqual(mockPerson);
    });

    it('should throw NOT_FOUND when person is not found', async () => {
      // Arrange
      prismaService.pessoa.findFirst.mockResolvedValue(null);

      // Act & Assert
      await expect(service.buscar(buscarDto)).rejects.toThrow(
        new HttpException('Usuario não encontrado', HttpStatus.NOT_FOUND)
      );
    });

    it('should handle database errors', async () => {
      // Arrange
      const error = new Error('Database connection error');
      prismaService.pessoa.findFirst.mockRejectedValue(error);

      // Act & Assert
      await expect(service.buscar(buscarDto)).rejects.toThrow(
        new HttpException('Database connection error', undefined)
      );
    });
  });

  describe('atualizar', () => {
    const atualizarDto = {
      CODPES: 1,
      NOME: 'João Atualizado',
      SOBRENOME: 'Silva Atualizado',
      CPF: '12345678900',
      TELEFONE: '11987654321',
    };

    it('should update person data successfully', async () => {
      // Arrange
      const existingPerson = {
        CODPES: 1,
        NOME: 'João',
        SOBRENOME: 'Silva',
        CPF: '12345678900',
        TELEFONE: '11987654321',
        CODUSU: 1,
      };

      const updatedPerson = {
        ...existingPerson,
        NOME: atualizarDto.NOME,
        SOBRENOME: atualizarDto.SOBRENOME,
      };

      prismaService.pessoa.findFirst.mockResolvedValue(existingPerson);
      prismaService.pessoa.update.mockResolvedValue(updatedPerson);

      // Act
      const result = await service.atualizar(atualizarDto);

      // Assert
      expect(prismaService.pessoa.findFirst).toHaveBeenCalledWith({
        where: { CODPES: atualizarDto.CODPES },
      });
      expect(prismaService.pessoa.update).toHaveBeenCalledWith({
        where: { CODPES: atualizarDto.CODPES },
        data: {
          CODPES: atualizarDto.CODPES,
          CPF: atualizarDto.CPF,
          NOME: atualizarDto.NOME,
          SOBRENOME: atualizarDto.SOBRENOME,
          TELEFONE: atualizarDto.TELEFONE,
        },
      });
      expect(result).toEqual(updatedPerson);
    });

    it('should throw NOT_FOUND when person is not found', async () => {
      // Arrange
      prismaService.pessoa.findFirst.mockResolvedValue(null);

      // Act & Assert
      await expect(service.atualizar(atualizarDto)).rejects.toThrow(
        new HttpException('Usuario não encontrado', HttpStatus.NOT_FOUND)
      );
    });

    it('should handle database errors during update', async () => {
      // Arrange
      const existingPerson = {
        CODPES: 1,
        NOME: 'João',
        SOBRENOME: 'Silva',
        CPF: '12345678900',
        TELEFONE: '11987654321',
        CODUSU: 1,
      };

      const error = new Error('Update failed');
      prismaService.pessoa.findFirst.mockResolvedValue(existingPerson);
      prismaService.pessoa.update.mockRejectedValue(error);

      // Act & Assert
      await expect(service.atualizar(atualizarDto)).rejects.toThrow(
        new HttpException('Update failed', undefined)
      );
    });
  });
});
