import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';
import { CreateAvaliacaoDto } from './dto/avaliacao.dto';

@Injectable()
export class AvaliacaoService {
  constructor(private readonly prisma: PrismaService) {}

  async criar(userId: number, body: CreateAvaliacaoDto) {
    try {
      const pessoa = await this.prisma.pessoa.findFirst({
        where: { CODUSU: userId },
      });

      if (!pessoa) {
        throw new HttpException('Pessoa não encontrada', HttpStatus.NOT_FOUND);
      }

      const produto = await this.prisma.produtos.findFirst({
        where: { CODPROD: body.CODPROD },
      });

      if (!produto) {
        throw new HttpException('Produto não encontrado', HttpStatus.NOT_FOUND);
      }

      const comprouProduto = await this.prisma.pedido.findFirst({
        where: {
          CODPES: pessoa.CODPES,
          ITENSPEDIDO: {
            some: {
              CODPROD: body.CODPROD,
            },
          },
        },
      });

      if (!comprouProduto) {
        throw new HttpException(
          'Você precisa comprar o produto antes de avaliá-lo',
          HttpStatus.FORBIDDEN,
        );
      }

      const avaliacaoExistente = await this.prisma.avaliacao.findFirst({
        where: {
          CODPROD: body.CODPROD,
          CODPES: pessoa.CODPES,
        },
      });

      if (avaliacaoExistente) {
        throw new HttpException(
          'Você já avaliou este produto',
          HttpStatus.CONFLICT,
        );
      }

      const avaliacao = await this.prisma.avaliacao.create({
        data: {
          NOTA: body.NOTA,
          COMENTARIO: body.COMENTARIO,
          CODPROD: body.CODPROD,
          CODPES: pessoa.CODPES,
        },
      });

      return avaliacao;
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async listar(CODPROD: number) {
    try {
      const produto = await this.prisma.produtos.findFirst({
        where: { CODPROD },
      });

      if (!produto) {
        throw new HttpException('Produto não encontrado', HttpStatus.NOT_FOUND);
      }

      const avaliacoes = await this.prisma.avaliacao.findMany({
        where: { CODPROD },
        include: {
          PESSOA: {
            select: {
              NOME: true,
              SOBRENOME: true,
            },
          },
        },
        orderBy: {
          DATAINC: 'desc',
        },
      });

      const total = avaliacoes.length;
      const somaNotas = avaliacoes.reduce((acc, av) => acc + av.NOTA, 0);
      const mediaNotas = total > 0 ? somaNotas / total : 0;

      return {
        avaliacoes,
        estatisticas: {
          total,
          mediaNotas: Number(mediaNotas.toFixed(1)),
        },
      };
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async verificarSeComprouProduto(userId: number, CODPROD: number) {
    try {
      const pessoa = await this.prisma.pessoa.findFirst({
        where: { CODUSU: userId },
      });

      if (!pessoa) {
        return { comprou: false };
      }

      const comprouProduto = await this.prisma.pedido.findFirst({
        where: {
          CODPES: pessoa.CODPES,
          ITENSPEDIDO: {
            some: {
              CODPROD,
            },
          },
        },
      });

      const jaAvaliou = await this.prisma.avaliacao.findFirst({
        where: {
          CODPROD,
          CODPES: pessoa.CODPES,
        },
      });

      return {
        comprou: !!comprouProduto,
        jaAvaliou: !!jaAvaliou,
      };
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
