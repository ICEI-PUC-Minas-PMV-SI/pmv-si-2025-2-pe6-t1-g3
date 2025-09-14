import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { ProdutoService } from '../../src/produto/produto.service';
import { PrismaService } from '../../src/services/prisma.service';
import { mockProduct, mockCategory } from '../utils/test-utils';

describe('ProdutoService', () => {
  let service: ProdutoService;
  let prismaService: any;

  beforeEach(async () => {
    const mockPrismaService = {
      produtos: {
        findFirst: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
      categorias: {
        findFirst: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProdutoService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<ProdutoService>(ProdutoService);
    prismaService = module.get(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('buscar', () => {
    const buscarDto = { CODPROD: 1 };

    it('should return product data when found', async () => {
      // Arrange
      prismaService.produtos.findFirst.mockResolvedValue(mockProduct);

      // Act
      const result = await service.buscar(buscarDto);

      // Assert
      expect(prismaService.produtos.findFirst).toHaveBeenCalledWith({
        where: { CODPROD: +buscarDto.CODPROD },
        include: { CATEGORIAS: true },
      });
      expect(result).toEqual(mockProduct);
    });

    it('should throw NOT_FOUND when product is not found', async () => {
      // Arrange
      prismaService.produtos.findFirst.mockResolvedValue(null);

      // Act & Assert
      await expect(service.buscar(buscarDto)).rejects.toThrow(
        new HttpException('Produto não encontrado', HttpStatus.NOT_FOUND)
      );
    });
  });

  describe('listar', () => {
    it('should return all products when no category is specified', async () => {
      // Arrange
      const mockProducts = [mockProduct];
      prismaService.produtos.findMany.mockResolvedValue(mockProducts);

      // Act
      const result = await service.listar({});

      // Assert
      expect(prismaService.produtos.findMany).toHaveBeenCalledWith({
        where: {},
        include: { CATEGORIAS: true },
      });
      expect(result).toEqual(mockProducts);
    });

    it('should return products by category when category is specified', async () => {
      // Arrange
      const listarDto = { CATEGORIA: 'MASCULINO' };
      const mockProducts = [mockProduct];

      prismaService.categorias.findFirst.mockResolvedValue(mockCategory);
      prismaService.produtos.findMany.mockResolvedValue(mockProducts);

      // Act
      const result = await service.listar(listarDto);

      // Assert
      expect(prismaService.categorias.findFirst).toHaveBeenCalledWith({
        where: { CATEGORIA: listarDto.CATEGORIA },
      });
      expect(prismaService.produtos.findMany).toHaveBeenCalledWith({
        where: { CODCAT: mockCategory.CODCAT },
        include: { CATEGORIAS: true },
      });
      expect(result).toEqual(mockProducts);
    });

    it('should throw NOT_FOUND when category is not found', async () => {
      // Arrange
      const listarDto = { CATEGORIA: 'INEXISTENTE' };
      prismaService.categorias.findFirst.mockResolvedValue(null);

      // Act & Assert
      await expect(service.listar(listarDto)).rejects.toThrow(
        new HttpException('Categoria não encontrada', HttpStatus.NOT_FOUND)
      );
    });
  });

  describe('cadastrar', () => {
    const cadastrarDto = {
      PRODUTO: 'Camiseta',
      DESCRICAO: 'Camiseta de algodão',
      IMAGEM: 'image.jpg',
      ESTOQUE: 10,
      VALOR: 29.99,
      CATEGORIA: 'MASCULINO',
    };

    it('should create product successfully', async () => {
      // Arrange
      const newProduct = { ...mockProduct, CODPROD: 2 };
      
      // Mock category creation for MASCULINO and FEMININO
      prismaService.categorias.findFirst
        .mockResolvedValueOnce(null) // MASCULINO not found
        .mockResolvedValueOnce(null) // FEMININO not found
        .mockResolvedValueOnce(mockCategory); // Return category for product creation

      prismaService.categorias.create.mockResolvedValue(mockCategory);
      prismaService.produtos.findFirst.mockResolvedValue(null); // Product doesn't exist
      prismaService.produtos.create.mockResolvedValue(newProduct);

      // Act
      const result = await service.cadastrar(cadastrarDto);

      // Assert
      expect(prismaService.categorias.create).toHaveBeenCalledTimes(2); // Create MASCULINO and FEMININO
      expect(prismaService.produtos.findFirst).toHaveBeenCalledWith({
        where: {
          PRODUTO: cadastrarDto.PRODUTO,
          CODCAT: mockCategory.CODCAT,
        },
      });
      expect(prismaService.produtos.create).toHaveBeenCalledWith({
        data: {
          PRODUTO: cadastrarDto.PRODUTO,
          DESCRICAO: cadastrarDto.DESCRICAO,
          IMAGEM: cadastrarDto.IMAGEM,
          ESTOQUE: cadastrarDto.ESTOQUE,
          VALOR: cadastrarDto.VALOR,
          CODCAT: mockCategory.CODCAT,
          DESCONTO: 0,
        },
      });
      expect(result).toEqual(newProduct);
    });

    it('should throw NOT_FOUND when category is invalid', async () => {
      // Arrange
      const invalidDto = { ...cadastrarDto, CATEGORIA: 'INVALID' };
      
      prismaService.categorias.findFirst
        .mockResolvedValueOnce(null) // MASCULINO not found
        .mockResolvedValueOnce(null) // FEMININO not found
        .mockResolvedValueOnce(null); // Invalid category not found

      prismaService.categorias.create.mockResolvedValue(mockCategory);

      // Act & Assert
      await expect(service.cadastrar(invalidDto)).rejects.toThrow(
        new HttpException(
          'Categoria não encontrada, tente "MASCULINO" ou "FEMININO"',
          HttpStatus.NOT_FOUND
        )
      );
    });

    it('should throw CONFLICT when product already exists', async () => {
      // Arrange
      prismaService.categorias.findFirst
        .mockResolvedValueOnce(null) // MASCULINO not found
        .mockResolvedValueOnce(null) // FEMININO not found
        .mockResolvedValueOnce(mockCategory); // Return category

      prismaService.categorias.create.mockResolvedValue(mockCategory);
      prismaService.produtos.findFirst.mockResolvedValue(mockProduct); // Product exists

      // Act & Assert
      await expect(service.cadastrar(cadastrarDto)).rejects.toThrow(
        new HttpException('Produto já cadastrado', HttpStatus.CONFLICT)
      );
    });
  });

  describe('atualizar', () => {
    const atualizarDto = {
      CODPROD: 1,
      PRODUTO: 'Camiseta Atualizada',
      DESCRICAO: 'Nova descrição',
      IMAGEM: 'new-image.jpg',
      ESTOQUE: 15,
      VALOR: 35.99,
      CATEGORIA: 'FEMININO',
      DESCONTO: 5,
    };

    it('should update product successfully', async () => {
      // Arrange
      const updatedProduct = { ...mockProduct, ...atualizarDto };
      const newCategory = { ...mockCategory, CATEGORIA: 'FEMININO', CODCAT: 2 };

      prismaService.produtos.findFirst.mockResolvedValue(mockProduct);
      prismaService.categorias.findFirst.mockResolvedValue(newCategory);
      prismaService.produtos.update.mockResolvedValue(updatedProduct);

      // Act
      const result = await service.atualizar(atualizarDto);

      // Assert
      expect(prismaService.produtos.findFirst).toHaveBeenCalledWith({
        where: { CODPROD: +atualizarDto.CODPROD },
      });
      expect(prismaService.categorias.findFirst).toHaveBeenCalledWith({
        where: { CATEGORIA: atualizarDto.CATEGORIA },
      });
      expect(prismaService.produtos.update).toHaveBeenCalledWith({
        where: { CODPROD: +atualizarDto.CODPROD },
        data: {
          PRODUTO: atualizarDto.PRODUTO,
          DESCRICAO: atualizarDto.DESCRICAO,
          IMAGEM: atualizarDto.IMAGEM,
          ESTOQUE: +atualizarDto.ESTOQUE,
          VALOR: +atualizarDto.VALOR,
          CODCAT: newCategory.CODCAT,
          DESCONTO: atualizarDto.DESCONTO,
        },
      });
      expect(result).toEqual(updatedProduct);
    });

    it('should throw NOT_FOUND when product is not found', async () => {
      // Arrange
      prismaService.produtos.findFirst.mockResolvedValue(null);

      // Act & Assert
      await expect(service.atualizar(atualizarDto)).rejects.toThrow(
        new HttpException('Produto não encontrado', HttpStatus.NOT_FOUND)
      );
    });
  });

  describe('remover', () => {
    const removerDto = { CODPROD: 1 };

    it('should delete product successfully', async () => {
      // Arrange
      prismaService.produtos.findFirst.mockResolvedValue(mockProduct);
      prismaService.produtos.delete.mockResolvedValue(mockProduct);

      // Act
      const result = await service.remover(removerDto);

      // Assert
      expect(prismaService.produtos.findFirst).toHaveBeenCalledWith({
        where: { CODPROD: +removerDto.CODPROD },
      });
      expect(prismaService.produtos.delete).toHaveBeenCalledWith({
        where: { CODPROD: +removerDto.CODPROD },
      });
      expect(result).toEqual(mockProduct);
    });

    it('should throw NOT_FOUND when product is not found', async () => {
      // Arrange
      prismaService.produtos.findFirst.mockResolvedValue(null);

      // Act & Assert
      await expect(service.remover(removerDto)).rejects.toThrow(
        new HttpException('Produto não encontrado', HttpStatus.NOT_FOUND)
      );
    });
  });
});
