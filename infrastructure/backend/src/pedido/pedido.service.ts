import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';

@Injectable()
export class PedidoService {
  constructor(private readonly prisma: PrismaService) {}

  async buscar(body: any) {
    try {
      const buscaPedido = await this.prisma.pedido.findFirst({
        where: { CODPED: +body.CODPED },
        include: { ITENSPEDIDO: true, ENDERECO: true },
      });

      if (!buscaPedido) {
        throw new HttpException('Pedido não encontrado', HttpStatus.NOT_FOUND);
      }

      return buscaPedido;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async listar(body: any) {
    try {
      if (body.CODPES) {
        const buscaPedido = await this.prisma.pedido.findMany({
          where: { CODPES: +body.CODPES },
          include: { ITENSPEDIDO: true, ENDERECO: true },
        });

        return buscaPedido;
      } else {
        throw new HttpException(
          'É necessario passar CODPES',
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async cadastrar(body: any) {
    try {
      if (!body.ITENS || !Array.isArray(body.ITENS)) {
        throw new Error('A propriedade ITENS deve ser um array.');
      }

      const cadastrar = await this.prisma.pedido.create({
        data: {
          CODEND: +body.CODEND,
          CODPES: +body.CODPES,
          DESCONTO: body.DESCONTO,
          FRETE: body.FRETE,
        },
      });

      let subtotal = 0;
      for (let index = 0; index < body.ITENS.length; index++) {
        const item = body.ITENS[index];

        const buscaProduto = await this.prisma.produtos.findFirst({
          where: { CODPROD: item.CODPROD },
        });

        if (buscaProduto) {
          const valorqtd = buscaProduto.VALOR * item.QTD;
          subtotal += valorqtd;
        }

        await this.prisma.itensPedido.create({
          data: {
            CODPED: cadastrar.CODPED,
            CODPROD: item.CODPROD,
            TAMANHO: item.TAMANHO,
            QTD: +item.QTD,
          },
        });
      }

      let valortotal = 0;
      valortotal = subtotal - cadastrar.DESCONTO + cadastrar.FRETE;

      const atualiza = await this.prisma.pedido.update({
        where: { CODPED: cadastrar.CODPED },
        data: {
          SUBTOTAL: subtotal,
          VALORTOTAL: valortotal,
        },
        include: { ITENSPEDIDO: true, ENDERECO: true },
      });

      return atualiza;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async atualizar(body: any) {
    try {
      const buscapedido = await this.prisma.pedido.findFirst({
        where: { CODPED: +body.CODPED },
      });

      if (!buscapedido) {
        throw new HttpException('Pedido não encontrado', HttpStatus.NOT_FOUND);
      }
      await this.prisma.itensPedido.deleteMany({
        where: { CODPED: buscapedido.CODPED },
      });

      let subtotal = 0;
      for (let index = 0; index < body.ITENS.length; index++) {
        const item = body.ITENS[index];

        const buscaProduto = await this.prisma.produtos.findFirst({
          where: { CODPROD: item.CODPROD },
        });

        if (buscaProduto) {
          const valorqtd = buscaProduto.VALOR * item.QTD;
          subtotal += valorqtd;
        }

        await this.prisma.itensPedido.create({
          data: {
            CODPED: buscapedido.CODPED,
            CODPROD: item.CODPROD,
            TAMANHO: item.TAMANHO,
            QTD: item.QTD,
          },
        });
      }

      let valortotal = 0;
      valortotal = subtotal - buscapedido.DESCONTO + buscapedido.FRETE;

      const atualiza = await this.prisma.pedido.update({
        where: { CODPED: buscapedido.CODPED },
        data: {
          SUBTOTAL: subtotal,
          VALORTOTAL: valortotal,
        },
        include: { ITENSPEDIDO: true, ENDERECO: true },
      });

      return atualiza;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async remover(body: any) {
    try {
      const buscaPedido = await this.prisma.pedido.findFirst({
        where: { CODPED: +body.CODPED },
      });

      if (!buscaPedido) {
        throw new HttpException('Pedido não encontrado', HttpStatus.NOT_FOUND);
      }

      await this.prisma.itensPedido.deleteMany({
        where: { CODPED: buscaPedido.CODPED },
      });

      await this.prisma.pedido.delete({
        where: { CODPED: buscaPedido.CODPED },
      });

      return buscaPedido;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
