import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';

@Injectable()
export class EnderecoService {
  constructor(private readonly prisma: PrismaService) {}

  async cadastrar(body: any) {
    try {
      const buscaPessoa = await this.prisma.pessoa.findFirst({
        where: { CODPES: body.CODPES },
      });

      if (!buscaPessoa) {
        throw new HttpException('Usuario não encontrado', HttpStatus.NOT_FOUND);
      }
      const buscaEnderecos = await this.prisma.endereco.findMany({
        where: { CODPES: body.CODPES },
      });

      if (buscaEnderecos.length === 3) {
        throw new HttpException(
          `Limite de endereços cadastrados (3)`,
          HttpStatus.NOT_ACCEPTABLE,
        );
      }
      const buscaEndereco = await this.prisma.endereco.findFirst({
        where: { DESCRICAO: body.DESCRICAO, CODPES: body.CODPES },
      });

      if (buscaEndereco) {
        throw new HttpException(
          `Descrição: ${body.DESCRICAO} já utilizada`,
          HttpStatus.CONFLICT,
        );
      }

      const cadastra = await this.prisma.endereco.create({
        data: {
          CODPES: body.CODPES,
          BAIRRO: body.BAIRRO,
          CEP: body.CEP,
          CIDADE: body.CIDADE,
          COMPLEMENTO: body.COMPLEMENTO,
          DESCRICAO: body.DESCRICAO,
          NUMERO: body.NUMERO,
          RUA: body.RUA,
        },
      });
      return cadastra;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
  async atualizar(body: any) {
    try {
      const buscaEndereco = await this.prisma.endereco.findFirst({
        where: { CODEND: body.CODEND },
      });

      if (!buscaEndereco) {
        throw new HttpException(
          'Endereço não encontrado',
          HttpStatus.NOT_FOUND,
        );
      }

      const atualizar = await this.prisma.endereco.update({
        where: { CODEND: body.CODEND },
        data: {
          CODPES: body.CODPES,
          BAIRRO: body.BAIRRO,
          CEP: body.CEP,
          CIDADE: body.CIDADE,
          COMPLEMENTO: body.COMPLEMENTO,
          DESCRICAO: body.DESCRICAO,

          NUMERO: body.NUMERO,
          RUA: body.RUA,
        },
      });
      return atualizar;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async deletar(body: any) {
    try {
      const codend = parseInt(body.CODEND);

      const buscaEndereco = await this.prisma.endereco.findFirst({
        where: { CODEND: codend },
      });

      if (!buscaEndereco) {
        throw new HttpException(
          'Endereço não encontrado',
          HttpStatus.NOT_FOUND,
        );
      }

      const deletar = await this.prisma.endereco.delete({
        where: { CODEND: codend },
      });
      return deletar;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
