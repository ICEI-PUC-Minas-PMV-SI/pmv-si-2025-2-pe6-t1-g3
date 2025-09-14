import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { EnderecoService } from '../../src/endereco/endereco.service';
import { PrismaService } from '../../src/services/prisma.service';
import { mockAddress } from '../utils/test-utils';

describe('EnderecoService', () => {
  let service: EnderecoService;
  let prismaService: any;

  beforeEach(async () => {
    const mockPrismaService = {
      endereco: {
        findFirst: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      pessoa: {
        findFirst: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EnderecoService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<EnderecoService>(EnderecoService);
    prismaService = module.get(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('cadastrar', () => {
    const cadastrarDto = {
      CODPES: 1,
      DESCRICAO: 'Casa',
      RUA: 'Rua das Flores',
      NUMERO: '123',
      COMPLEMENTO: 'Apto 42',
      BAIRRO: 'Centro',
      CIDADE: 'São Paulo',
      CEP: '12345678',
    };

    it('should create address successfully', async () => {
      // Arrange
      const mockPerson = { CODPES: 1, NOME: 'João', SOBRENOME: 'Silva' };
      const newAddress = { ...mockAddress, CODPES: cadastrarDto.CODPES };

      prismaService.pessoa.findFirst.mockResolvedValue(mockPerson);
      prismaService.endereco.findMany.mockResolvedValue([]); // No existing addresses
      prismaService.endereco.findFirst.mockResolvedValue(null); // Description not used
      prismaService.endereco.create.mockResolvedValue(newAddress);

      // Act
      const result = await service.cadastrar(cadastrarDto);

      // Assert
      expect(prismaService.pessoa.findFirst).toHaveBeenCalledWith({
        where: { CODPES: cadastrarDto.CODPES },
      });
      expect(prismaService.endereco.findMany).toHaveBeenCalledWith({
        where: { CODPES: cadastrarDto.CODPES },
      });
      expect(prismaService.endereco.findFirst).toHaveBeenCalledWith({
        where: { DESCRICAO: cadastrarDto.DESCRICAO, CODPES: cadastrarDto.CODPES },
      });
      expect(prismaService.endereco.create).toHaveBeenCalledWith({
        data: {
          CODPES: cadastrarDto.CODPES,
          BAIRRO: cadastrarDto.BAIRRO,
          CEP: cadastrarDto.CEP,
          CIDADE: cadastrarDto.CIDADE,
          COMPLEMENTO: cadastrarDto.COMPLEMENTO,
          DESCRICAO: cadastrarDto.DESCRICAO,
          NUMERO: cadastrarDto.NUMERO,
          RUA: cadastrarDto.RUA,
        },
      });
      expect(result).toEqual(newAddress);
    });

    it('should throw NOT_FOUND when person is not found', async () => {
      // Arrange
      prismaService.pessoa.findFirst.mockResolvedValue(null);

      // Act & Assert
      await expect(service.cadastrar(cadastrarDto)).rejects.toThrow(
        new HttpException('Usuario não encontrado', HttpStatus.NOT_FOUND)
      );
    });

    it('should throw NOT_ACCEPTABLE when person has reached address limit', async () => {
      // Arrange
      const mockPerson = { CODPES: 1, NOME: 'João', SOBRENOME: 'Silva' };
      const existingAddresses = [mockAddress, mockAddress, mockAddress]; // 3 addresses

      prismaService.pessoa.findFirst.mockResolvedValue(mockPerson);
      prismaService.endereco.findMany.mockResolvedValue(existingAddresses);

      // Act & Assert
      await expect(service.cadastrar(cadastrarDto)).rejects.toThrow(
        new HttpException('Limite de endereços cadastrados (3)', HttpStatus.NOT_ACCEPTABLE)
      );
    });

    it('should throw CONFLICT when description is already used', async () => {
      // Arrange
      const mockPerson = { CODPES: 1, NOME: 'João', SOBRENOME: 'Silva' };
      const existingAddress = { ...mockAddress, DESCRICAO: cadastrarDto.DESCRICAO };

      prismaService.pessoa.findFirst.mockResolvedValue(mockPerson);
      prismaService.endereco.findMany.mockResolvedValue([]);
      prismaService.endereco.findFirst.mockResolvedValue(existingAddress);

      // Act & Assert
      await expect(service.cadastrar(cadastrarDto)).rejects.toThrow(
        new HttpException(`Descrição: ${cadastrarDto.DESCRICAO} já utilizada`, HttpStatus.CONFLICT)
      );
    });
  });

  describe('atualizar', () => {
    const atualizarDto = {
      CODEND: 1,
      CODPES: 1,
      DESCRICAO: 'Casa Atualizada',
      RUA: 'Rua das Flores Atualizada',
      NUMERO: '456',
      COMPLEMENTO: 'Apto 100',
      BAIRRO: 'Centro Atualizado',
      CIDADE: 'São Paulo Atualizada',
      CEP: '87654321',
    };

    it('should update address successfully', async () => {
      // Arrange
      const updatedAddress = { ...mockAddress, ...atualizarDto };

      prismaService.endereco.findFirst.mockResolvedValue(mockAddress);
      prismaService.endereco.update.mockResolvedValue(updatedAddress);

      // Act
      const result = await service.atualizar(atualizarDto);

      // Assert
      expect(prismaService.endereco.findFirst).toHaveBeenCalledWith({
        where: { CODEND: atualizarDto.CODEND },
      });
      expect(prismaService.endereco.update).toHaveBeenCalledWith({
        where: { CODEND: atualizarDto.CODEND },
        data: {
          CODPES: atualizarDto.CODPES,
          BAIRRO: atualizarDto.BAIRRO,
          CEP: atualizarDto.CEP,
          CIDADE: atualizarDto.CIDADE,
          COMPLEMENTO: atualizarDto.COMPLEMENTO,
          DESCRICAO: atualizarDto.DESCRICAO,
          NUMERO: atualizarDto.NUMERO,
          RUA: atualizarDto.RUA,
        },
      });
      expect(result).toEqual(updatedAddress);
    });

    it('should throw NOT_FOUND when address is not found', async () => {
      // Arrange
      prismaService.endereco.findFirst.mockResolvedValue(null);

      // Act & Assert
      await expect(service.atualizar(atualizarDto)).rejects.toThrow(
        new HttpException('Endereço não encontrado', HttpStatus.NOT_FOUND)
      );
    });
  });

  describe('deletar', () => {
    const deletarDto = { CODEND: 1 };

    it('should delete address successfully', async () => {
      // Arrange
      prismaService.endereco.findFirst.mockResolvedValue(mockAddress);
      prismaService.endereco.delete.mockResolvedValue(mockAddress);

      // Act
      const result = await service.deletar(deletarDto);

      // Assert
      expect(prismaService.endereco.findFirst).toHaveBeenCalledWith({
        where: { CODEND: parseInt(deletarDto.CODEND.toString()) },
      });
      expect(prismaService.endereco.delete).toHaveBeenCalledWith({
        where: { CODEND: parseInt(deletarDto.CODEND.toString()) },
      });
      expect(result).toEqual(mockAddress);
    });

    it('should throw NOT_FOUND when address is not found', async () => {
      // Arrange
      prismaService.endereco.findFirst.mockResolvedValue(null);

      // Act & Assert
      await expect(service.deletar(deletarDto)).rejects.toThrow(
        new HttpException('Endereço não encontrado', HttpStatus.NOT_FOUND)
      );
    });

    it('should handle string CODEND parameter', async () => {
      // Arrange
      const deletarDtoString = { CODEND: '1' };
      prismaService.endereco.findFirst.mockResolvedValue(mockAddress);
      prismaService.endereco.delete.mockResolvedValue(mockAddress);

      // Act
      const result = await service.deletar(deletarDtoString);

      // Assert
      expect(prismaService.endereco.findFirst).toHaveBeenCalledWith({
        where: { CODEND: 1 },
      });
      expect(prismaService.endereco.delete).toHaveBeenCalledWith({
        where: { CODEND: 1 },
      });
      expect(result).toEqual(mockAddress);
    });
  });
});
