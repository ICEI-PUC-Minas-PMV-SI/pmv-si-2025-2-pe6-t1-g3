import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';

@Injectable()
export class ProdutoService {
  constructor(private readonly prisma: PrismaService) {}

  async buscar(body: any) {
    try {
      const buscaProduto = await this.prisma.produtos.findFirst({
        where: { CODPROD: +body.CODPROD },
        include: { CATEGORIAS: true },
      });

      if (!buscaProduto) {
        throw new HttpException('Produto não encontrado', HttpStatus.NOT_FOUND);
      }

      return buscaProduto;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async listar(body: any) {
    try {
      if (body.CATEGORIA) {
        const categoria = await this.prisma.categorias.findFirst({
          where: { CATEGORIA: body.CATEGORIA },
        });

        if (!categoria) {
          throw new HttpException(
            'Categoria não encontrada',
            HttpStatus.NOT_FOUND,
          );
        }

        const buscaProduto = await this.prisma.produtos.findMany({
          where: { CODCAT: categoria.CODCAT },
          include: { CATEGORIAS: true },
        });

        return buscaProduto;
      } else {
        const buscaProduto = await this.prisma.produtos.findMany({
          where: {},
          include: { CATEGORIAS: true },
        });

        return buscaProduto;
      }
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async cadastrar(body: any) {
    try {
      const categorias = ['MASCULINO', 'FEMININO'];
      for (let element of categorias) {
        const existingCategory = await this.prisma.categorias.findFirst({
          where: { CATEGORIA: element },
        });
        if (!existingCategory) {
          await this.prisma.categorias.create({
            data: { CATEGORIA: element },
          });
        }
      }

      const categoria = await this.prisma.categorias.findFirst({
        where: { CATEGORIA: body.CATEGORIA },
      });

      if (!categoria) {
        throw new HttpException(
          'Categoria não encontrada, tente "MASCULINO" ou "FEMININO"',
          HttpStatus.NOT_FOUND,
        );
      }

      const buscaproduto = await this.prisma.produtos.findFirst({
        where: {
          PRODUTO: body.PRODUTO,
          CODCAT: categoria.CODCAT,
        },
      });

      if (buscaproduto) {
        throw new HttpException('Produto já cadastrado', HttpStatus.CONFLICT);
      }

      const cadastrar = await this.prisma.produtos.create({
        data: {
          PRODUTO: body.PRODUTO,
          DESCRICAO: body.DESCRICAO,
          IMAGEM: body.IMAGEM,
          ESTOQUE: body.ESTOQUE,
          VALOR: body.VALOR,
          CODCAT: categoria.CODCAT,
          DESCONTO: 0,
        },
      });
      return cadastrar;
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  async atualizar(body: any) {
    try {
      const buscaproduto = await this.prisma.produtos.findFirst({
        where: { CODPROD: +body.CODPROD },
      });

      if (!buscaproduto) {
        throw new HttpException('Produto não encontrado', HttpStatus.NOT_FOUND);
      }

      let codcat = null;

      if (body.CATEGORIA) {
        const categoria = await this.prisma.categorias.findFirst({
          where: { CATEGORIA: body.CATEGORIA },
        });

        if (!categoria) {
          throw new HttpException(
            'Categoria não encontrada, tente "MASCULINO" ou "FEMININO"',
            HttpStatus.NOT_FOUND,
          );
        }
        codcat = categoria.CODCAT;
      }

      const atualizar = await this.prisma.produtos.update({
        where: { CODPROD: +body.CODPROD },
        data: {
          PRODUTO: body.PRODUTO,
          DESCRICAO: body.DESCRICAO,
          IMAGEM: body.IMAGEM,
          ESTOQUE: +body.ESTOQUE,
          VALOR: +body.VALOR,
          CODCAT: codcat,
          DESCONTO: body.DESCONTO,
        },
      });
      return atualizar;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async remover(body: any) {
    try {
      const buscaProduto = await this.prisma.produtos.findFirst({
        where: { CODPROD: +body.CODPROD },
      });

      if (!buscaProduto) {
        throw new HttpException('Produto não encontrado', HttpStatus.NOT_FOUND);
      }

      return await this.prisma.produtos.delete({
        where: { CODPROD: +body.CODPROD },
      });
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
