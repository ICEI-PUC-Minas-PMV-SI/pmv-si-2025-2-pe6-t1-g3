import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { PedidoService } from '../../src/pedido/pedido.service';
import { PrismaService } from '../../src/services/prisma.service';
import { mockOrder, mockProduct, mockAddress, createMockPrismaService } from '../utils/test-utils';

describe('PedidoService', () => {
  let service: PedidoService;
  let prismaService: ReturnType<typeof createMockPrismaService>;

  beforeEach(async () => {
    const mockPrismaService = createMockPrismaService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PedidoService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<PedidoService>(PedidoService);
    prismaService = module.get(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('buscar', () => {
    const buscarDto = { CODPED: 1 };

    it('should return order data when found', async () => {
      // Arrange
      prismaService.pedido.findFirst.mockResolvedValue(mockOrder);

      // Act
      const result = await service.buscar(buscarDto);

      // Assert
      expect(prismaService.pedido.findFirst).toHaveBeenCalledWith({
        where: { CODPED: +buscarDto.CODPED },
        include: { 
          ITENSPEDIDO: { 
            include: { 
              Produtos: true 
            } 
          }, 
          ENDERECO: true 
        },
      });
      expect(result).toEqual(mockOrder);
    });

    it('should throw NOT_FOUND when order is not found', async () => {
      // Arrange
      prismaService.pedido.findFirst.mockResolvedValue(null);

      // Act & Assert
      await expect(service.buscar(buscarDto)).rejects.toThrow(
        new HttpException('Pedido não encontrado', HttpStatus.NOT_FOUND)
      );
    });
  });

  describe('listar', () => {
    const listarDto = { CODPES: 1 };

    it('should return orders for a specific person', async () => {
      // Arrange
      const mockOrders = [mockOrder];
      prismaService.pedido.findMany.mockResolvedValue(mockOrders);

      // Act
      const result = await service.listar(listarDto);

      // Assert
      expect(prismaService.pedido.findMany).toHaveBeenCalledWith({
        where: { CODPES: +listarDto.CODPES },
        orderBy: { DATAINC: 'desc' },
        include: { 
          ITENSPEDIDO: { 
            include: { 
              Produtos: true 
            } 
          }, 
          ENDERECO: true 
        },
      });
      expect(result).toEqual(mockOrders);
    });

    it('should throw BAD_REQUEST when CODPES is not provided', async () => {
      // Arrange
      const invalidDto = {};

      // Act & Assert
      await expect(service.listar(invalidDto)).rejects.toThrow(
        new HttpException('É necessario passar CODPES', HttpStatus.BAD_REQUEST)
      );
    });
  });

  describe('cadastrar', () => {
    const cadastrarDto = {
      CODPES: 1,
      CODEND: 1,
      DESCONTO: 0,
      FRETE: 10.00,
      ITENS: [
        {
          CODPROD: 1,
          TAMANHO: 'M',
          QTD: 2,
        },
      ],
    };

    it('should create order successfully', async () => {
      // Arrange
      const newOrder = {
        CODPED: 2,
        CODPES: cadastrarDto.CODPES,
        CODEND: cadastrarDto.CODEND,
        DESCONTO: cadastrarDto.DESCONTO,
        FRETE: cadastrarDto.FRETE,
        SUBTOTAL: 0,
        VALORTOTAL: 0,
      };

      const updatedOrder = {
        ...newOrder,
        SUBTOTAL: 59.98,
        VALORTOTAL: 69.98,
        ITENSPEDIDO: cadastrarDto.ITENS.map(item => ({
          ...item,
          Produtos: mockProduct,
        })),
        ENDERECO: mockAddress,
      };

      prismaService.pedido.create.mockResolvedValue(newOrder);
      prismaService.produtos.findFirst.mockResolvedValue(mockProduct);
      prismaService.itensPedido.create.mockResolvedValue({});
      prismaService.pedido.update.mockResolvedValue(updatedOrder);

      // Act
      const result = await service.cadastrar(cadastrarDto);

      // Assert
      expect(prismaService.pedido.create).toHaveBeenCalledWith({
        data: {
          CODEND: +cadastrarDto.CODEND,
          CODPES: +cadastrarDto.CODPES,
          DESCONTO: cadastrarDto.DESCONTO,
          FRETE: cadastrarDto.FRETE,
        },
      });

      expect(prismaService.produtos.findFirst).toHaveBeenCalledWith({
        where: { CODPROD: +cadastrarDto.ITENS[0].CODPROD },
      });

      expect(prismaService.itensPedido.create).toHaveBeenCalledWith({
        data: {
          CODPED: newOrder.CODPED,
          CODPROD: +cadastrarDto.ITENS[0].CODPROD,
          TAMANHO: cadastrarDto.ITENS[0].TAMANHO || null,
          QTD: +cadastrarDto.ITENS[0].QTD,
        },
      });

      expect(prismaService.pedido.update).toHaveBeenCalledWith({
        where: { CODPED: newOrder.CODPED },
        data: {
          SUBTOTAL: expect.closeTo(59.98, 2),
          VALORTOTAL: expect.closeTo(69.98, 2),
        },
        include: { 
          ITENSPEDIDO: { 
            include: { 
              Produtos: true 
            } 
          }, 
          ENDERECO: true 
        },
      });

      expect(result).toEqual(updatedOrder);
    });

    it('should throw error when ITENS is not an array', async () => {
      // Arrange
      const invalidDto = {
        CODPES: 1,
        CODEND: 1,
        DESCONTO: 0,
        FRETE: 10.00,
        ITENS: 'not an array',
      };

      // Act & Assert
      await expect(service.cadastrar(invalidDto)).rejects.toThrow(
        new HttpException('A propriedade ITENS deve ser um array.', HttpStatus.BAD_REQUEST)
      );
    });

    it('should throw error when ITENS is missing', async () => {
      // Arrange
      const invalidDto = {
        CODPES: 1,
        CODEND: 1,
        DESCONTO: 0,
        FRETE: 10.00,
      };

      // Act & Assert
      await expect(service.cadastrar(invalidDto)).rejects.toThrow(
        new HttpException('A propriedade ITENS deve ser um array.', HttpStatus.BAD_REQUEST)
      );
    });

    it('should throw error when ITENS array is empty', async () => {
      // Arrange
      const invalidDto = {
        CODPES: 1,
        CODEND: 1,
        DESCONTO: 0,
        FRETE: 10.00,
        ITENS: [],
      };

      // Act & Assert
      await expect(service.cadastrar(invalidDto)).rejects.toThrow(
        new HttpException('O pedido deve conter pelo menos um item.', HttpStatus.BAD_REQUEST)
      );
    });
  });

  describe('atualizar', () => {
    const atualizarDto = {
      CODPED: 1,
      ITENS: [
        {
          CODPROD: 1,
          TAMANHO: 'L',
          QTD: 3,
        },
      ],
    };

    it('should update order successfully', async () => {
      // Arrange
      const existingOrder = { ...mockOrder };
      const updatedOrder = {
        ...existingOrder,
        SUBTOTAL: 89.97,
        VALORTOTAL: 99.97,
        ITENSPEDIDO: atualizarDto.ITENS,
      };

      prismaService.pedido.findFirst.mockResolvedValue(existingOrder);
      prismaService.itensPedido.deleteMany.mockResolvedValue({});
      prismaService.produtos.findFirst.mockResolvedValue(mockProduct);
      prismaService.itensPedido.create.mockResolvedValue({});
      prismaService.pedido.update.mockResolvedValue(updatedOrder);

      // Act
      const result = await service.atualizar(atualizarDto);

      // Assert
      expect(prismaService.pedido.findFirst).toHaveBeenCalledWith({
        where: { CODPED: +atualizarDto.CODPED },
      });

      expect(prismaService.itensPedido.deleteMany).toHaveBeenCalledWith({
        where: { CODPED: existingOrder.CODPED },
      });

      expect(prismaService.produtos.findFirst).toHaveBeenCalledWith({
        where: { CODPROD: +atualizarDto.ITENS[0].CODPROD },
      });

      expect(prismaService.itensPedido.create).toHaveBeenCalledWith({
        data: {
          CODPED: existingOrder.CODPED,
          CODPROD: +atualizarDto.ITENS[0].CODPROD,
          TAMANHO: atualizarDto.ITENS[0].TAMANHO || null,
          QTD: +atualizarDto.ITENS[0].QTD,
        },
      });

      expect(prismaService.pedido.update).toHaveBeenCalledWith({
        where: { CODPED: existingOrder.CODPED },
        data: {
          SUBTOTAL: 89.97,
          VALORTOTAL: 99.97,
        },
        include: { 
          ITENSPEDIDO: { 
            include: { 
              Produtos: true 
            } 
          }, 
          ENDERECO: true 
        },
      });

      expect(result).toEqual(updatedOrder);
    });

    it('should throw NOT_FOUND when order is not found', async () => {
      // Arrange
      prismaService.pedido.findFirst.mockResolvedValue(null);

      // Act & Assert
      await expect(service.atualizar(atualizarDto)).rejects.toThrow(
        new HttpException('Pedido não encontrado', HttpStatus.NOT_FOUND)
      );
    });
  });

  describe('remover', () => {
    const removerDto = { CODPED: 1 };

    it('should delete order successfully', async () => {
      // Arrange
      prismaService.pedido.findFirst.mockResolvedValue(mockOrder);
      prismaService.itensPedido.deleteMany.mockResolvedValue({});
      prismaService.pedido.delete.mockResolvedValue(mockOrder);

      // Act
      const result = await service.remover(removerDto);

      // Assert
      expect(prismaService.pedido.findFirst).toHaveBeenCalledWith({
        where: { CODPED: +removerDto.CODPED },
      });

      expect(prismaService.itensPedido.deleteMany).toHaveBeenCalledWith({
        where: { CODPED: mockOrder.CODPED },
      });

      expect(prismaService.pedido.delete).toHaveBeenCalledWith({
        where: { CODPED: mockOrder.CODPED },
      });

      expect(result).toEqual(mockOrder);
    });

    it('should throw NOT_FOUND when order is not found', async () => {
      // Arrange
      prismaService.pedido.findFirst.mockResolvedValue(null);

      // Act & Assert
      await expect(service.remover(removerDto)).rejects.toThrow(
        new HttpException('Pedido não encontrado', HttpStatus.NOT_FOUND)
      );
    });
  });
});
