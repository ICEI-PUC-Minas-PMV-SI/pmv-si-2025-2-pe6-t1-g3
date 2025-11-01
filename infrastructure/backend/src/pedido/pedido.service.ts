import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';

@Injectable()
export class PedidoService {
  private readonly logger = new Logger(PedidoService.name);

  constructor(private readonly prisma: PrismaService) {}

  async buscar(body: any) {
    try {
      const buscaPedido = await this.prisma.pedido.findFirst({
        where: { CODPED: +body.CODPED },
        include: { 
          ITENSPEDIDO: { 
            include: { 
              Produtos: true 
            } 
          }, 
          ENDERECO: true 
        },
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
      const where = body.CODPES ? { CODPES: +body.CODPES } : {};

      const buscaPedido = await this.prisma.pedido.findMany({
        where,
        orderBy: { DATAINC: 'desc' },
        include: {
          ITENSPEDIDO: {
            include: {
              Produtos: true
            }
          },
          ENDERECO: true,
          PESSOA: {
            select: {
              NOME: true,
              SOBRENOME: true,
              CPF: true,
              TELEFONE: true
            }
          }
        },
      });

      return buscaPedido;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async cadastrar(body: any) {
    try {
      if (!body.ITENS || !Array.isArray(body.ITENS)) {
        throw new HttpException(
          'A propriedade ITENS deve ser um array.',
          HttpStatus.BAD_REQUEST,
        );
      }

      if (body.ITENS.length === 0) {
        throw new HttpException(
          'O pedido deve conter pelo menos um item.',
          HttpStatus.BAD_REQUEST,
        );
      }

      this.logger.log(
        `Criando pedido para usuário ${body.CODPES} com ${body.ITENS.length} itens`,
      );

      const cadastrar = await this.prisma.pedido.create({
        data: {
          CODEND: +body.CODEND,
          CODPES: +body.CODPES,
          DESCONTO: body.DESCONTO || 0,
          FRETE: body.FRETE || 0,
        },
      });

      let subtotal = 0;
      const produtosNaoEncontrados: number[] = [];

      for (let index = 0; index < body.ITENS.length; index++) {
        const item = body.ITENS[index];

        // Normalizar CODPROD e QUANTIDADE
        const codprodRaw = item.CODPROD ?? item.codprod;
        const quantidadeRaw =
          item.QUANTIDADE ??
          item.QTD ??
          item.quantidade ??
          item.qtd ??
          1;

        const codprod = Number.parseInt(String(codprodRaw), 10);
        const qtd = Number.parseInt(String(quantidadeRaw), 10);

        if (
          !Number.isFinite(codprod) ||
          !Number.isFinite(qtd) ||
          codprod <= 0 ||
          qtd <= 0
        ) {
          this.logger.warn(
            `Item ${index} inválido: CODPROD=${codprodRaw}, QUANTIDADE=${quantidadeRaw}`,
          );
          continue;
        }

        this.logger.debug(
          `Item normalizado ${index}: CODPROD=${codprod}, QUANTIDADE=${qtd}`,
        );

        const buscaProduto = await this.prisma.produtos.findFirst({
          where: { CODPROD: codprod },
        });

        if (!buscaProduto) {
          this.logger.error(
            `Produto com CODPROD ${codprod} não encontrado`,
          );
          produtosNaoEncontrados.push(codprod);
          continue;
        }

        if (!buscaProduto.VALOR || buscaProduto.VALOR <= 0) {
          this.logger.warn(
            `Produto ${codprod} possui valor inválido: ${buscaProduto.VALOR}`,
          );
        }

        const valorqtd = buscaProduto.VALOR * qtd;
        subtotal += valorqtd;

        this.logger.debug(
          `Item ${index}: Produto ${codprod}, QUANTIDADE ${qtd}, Valor unitário ${buscaProduto.VALOR}, Subtotal item: ${valorqtd}`,
        );

        await this.prisma.itensPedido.create({
          data: {
            CODPED: cadastrar.CODPED,
            CODPROD: codprod,
            TAMANHO: item.TAMANHO || null,
            QTD: qtd,
          },
        });
      }

      if (produtosNaoEncontrados.length > 0) {
        this.logger.error(
          `Produtos não encontrados: ${produtosNaoEncontrados.join(', ')}`,
        );
        throw new HttpException(
          `Um ou mais produtos não foram encontrados: ${produtosNaoEncontrados.join(', ')}`,
          HttpStatus.BAD_REQUEST,
        );
      }

      if (subtotal <= 0) {
        this.logger.error(
          `Subtotal inválido calculado: ${subtotal}. Verifique os valores dos produtos.`,
        );
        throw new HttpException(
          'Não foi possível calcular o valor do pedido. Verifique se os produtos possuem valores válidos.',
          HttpStatus.BAD_REQUEST,
        );
      }

      const desconto = cadastrar.DESCONTO || 0;
      const frete = cadastrar.FRETE || 0;
      const valortotal = subtotal - desconto + frete;

      if (valortotal < 0) {
        this.logger.warn(
          `Valor total negativo calculado: ${valortotal}. Subtotal: ${subtotal}, Desconto: ${desconto}, Frete: ${frete}`,
        );
      }

      this.logger.log(
        `Pedido ${cadastrar.CODPED} - Subtotal: ${subtotal}, Desconto: ${desconto}, Frete: ${frete}, Total: ${valortotal}`,
      );

      const atualiza = await this.prisma.pedido.update({
        where: { CODPED: cadastrar.CODPED },
        data: {
          SUBTOTAL: subtotal,
          VALORTOTAL: valortotal,
        },
        include: {
          ITENSPEDIDO: {
            include: {
              Produtos: true,
            },
          },
          ENDERECO: true,
        },
      });

      // Validação final dos valores salvos
      if (!atualiza.SUBTOTAL || !atualiza.VALORTOTAL) {
        this.logger.error(
          `Valores não foram salvos corretamente no pedido ${cadastrar.CODPED}`,
        );
        throw new HttpException(
          'Erro ao salvar valores do pedido',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return atualiza;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(`Erro ao cadastrar pedido: ${error.message}`, error.stack);
      throw new HttpException(
        error.message || 'Erro interno do servidor',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
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

      if (body.STATUS !== undefined) {
        const atualiza = await this.prisma.pedido.update({
          where: { CODPED: buscapedido.CODPED },
          data: {
            STATUS: body.STATUS,
          },
          include: {
            ITENSPEDIDO: {
              include: {
                Produtos: true,
              },
            },
            ENDERECO: true,
          },
        });
        return atualiza;
      }

      if (!body.ITENS || !Array.isArray(body.ITENS)) {
        throw new HttpException(
          'A propriedade ITENS deve ser um array.',
          HttpStatus.BAD_REQUEST,
        );
      }

      this.logger.log(
        `Atualizando pedido ${body.CODPED} com ${body.ITENS.length} itens`,
      );

      await this.prisma.itensPedido.deleteMany({
        where: { CODPED: buscapedido.CODPED },
      });

      let subtotal = 0;
      const produtosNaoEncontrados: number[] = [];

      for (let index = 0; index < body.ITENS.length; index++) {
        const item = body.ITENS[index];

        // Normalizar CODPROD e QUANTIDADE
        const codprodRaw = item.CODPROD ?? item.codprod;
        const quantidadeRaw =
          item.QUANTIDADE ??
          item.QTD ??
          item.quantidade ??
          item.qtd ??
          1;

        const codprod = Number.parseInt(String(codprodRaw), 10);
        const qtd = Number.parseInt(String(quantidadeRaw), 10);

        if (
          !Number.isFinite(codprod) ||
          !Number.isFinite(qtd) ||
          codprod <= 0 ||
          qtd <= 0
        ) {
          this.logger.warn(
            `Item ${index} inválido: CODPROD=${codprodRaw}, QUANTIDADE=${quantidadeRaw}`,
          );
          continue;
        }

        this.logger.debug(
          `Item normalizado ${index}: CODPROD=${codprod}, QUANTIDADE=${qtd}`,
        );

        const buscaProduto = await this.prisma.produtos.findFirst({
          where: { CODPROD: codprod },
        });

        if (!buscaProduto) {
          this.logger.error(
            `Produto com CODPROD ${codprod} não encontrado`,
          );
          produtosNaoEncontrados.push(codprod);
          continue;
        }

        if (!buscaProduto.VALOR || buscaProduto.VALOR <= 0) {
          this.logger.warn(
            `Produto ${codprod} possui valor inválido: ${buscaProduto.VALOR}`,
          );
        }

        const valorqtd = buscaProduto.VALOR * qtd;
        subtotal += valorqtd;

        this.logger.debug(
          `Item ${index}: Produto ${codprod}, QUANTIDADE ${qtd}, Valor unitário ${buscaProduto.VALOR}, Subtotal item: ${valorqtd}`,
        );

        await this.prisma.itensPedido.create({
          data: {
            CODPED: buscapedido.CODPED,
            CODPROD: codprod,
            TAMANHO: item.TAMANHO || null,
            QTD: qtd,
          },
        });
      }

      if (produtosNaoEncontrados.length > 0) {
        this.logger.error(
          `Produtos não encontrados: ${produtosNaoEncontrados.join(', ')}`,
        );
        throw new HttpException(
          `Um ou mais produtos não foram encontrados: ${produtosNaoEncontrados.join(', ')}`,
          HttpStatus.BAD_REQUEST,
        );
      }

      if (subtotal <= 0) {
        this.logger.error(
          `Subtotal inválido calculado: ${subtotal}. Verifique os valores dos produtos.`,
        );
        throw new HttpException(
          'Não foi possível calcular o valor do pedido. Verifique se os produtos possuem valores válidos.',
          HttpStatus.BAD_REQUEST,
        );
      }

      const desconto = buscapedido.DESCONTO || 0;
      const frete = buscapedido.FRETE || 0;
      const valortotal = subtotal - desconto + frete;

      if (valortotal < 0) {
        this.logger.warn(
          `Valor total negativo calculado: ${valortotal}. Subtotal: ${subtotal}, Desconto: ${desconto}, Frete: ${frete}`,
        );
      }

      this.logger.log(
        `Pedido ${body.CODPED} atualizado - Subtotal: ${subtotal}, Desconto: ${desconto}, Frete: ${frete}, Total: ${valortotal}`,
      );

      const atualiza = await this.prisma.pedido.update({
        where: { CODPED: buscapedido.CODPED },
        data: {
          SUBTOTAL: subtotal,
          VALORTOTAL: valortotal,
        },
        include: {
          ITENSPEDIDO: {
            include: {
              Produtos: true,
            },
          },
          ENDERECO: true,
        },
      });

      // Validação final dos valores salvos
      if (!atualiza.SUBTOTAL || !atualiza.VALORTOTAL) {
        this.logger.error(
          `Valores não foram salvos corretamente no pedido ${body.CODPED}`,
        );
        throw new HttpException(
          'Erro ao salvar valores do pedido',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      return atualiza;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      this.logger.error(
        `Erro ao atualizar pedido: ${error.message}`,
        error.stack,
      );
      throw new HttpException(
        error.message || 'Erro interno do servidor',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
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
