import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/services/prisma.service';

@Injectable()
export class PessoaService {
  constructor(private readonly prisma: PrismaService) {}

  async buscar(body: any) {
    try {
      const buscaPessoa = await this.prisma.pessoa.findFirst({
        where: { CODPES: body.CODPES },
        include: { USUARIO: true, ENDERECOS: true },
      });

      if (!buscaPessoa) {
        throw new HttpException('Usuario não encontrado', HttpStatus.NOT_FOUND);
      }

      return buscaPessoa;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
  async atualizar(body: any) {
    try {
      const buscaPessoa = await this.prisma.pessoa.findFirst({
        where: { CODPES: body.CODPES },
      });

      if (!buscaPessoa) {
        throw new HttpException('Usuario não encontrado', HttpStatus.NOT_FOUND);
      }

      const atualizar = await this.prisma.pessoa.update({
        where: { CODPES: body.CODPES },
        data: {
          CODPES: body.CODPES,
          CPF: body.CPF,
          NOME: body.NOME,
          SOBRENOME: body.SOBRENOME,
          TELEFONE: body.TELEFONE,
        },
      });
      return atualizar;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
