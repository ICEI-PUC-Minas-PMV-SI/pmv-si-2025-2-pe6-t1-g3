import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';

import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PessoaService } from './pessoa.service';
import { BuscarPessoaDto } from './dto/buscar-pessoa.dto';

@Controller('pessoa')
@ApiTags('Pessoa')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class PessoaController {
  constructor(private readonly pessoaService: PessoaService) {}

  @Post('/atualizar')
  cadastrar(@Body() body: any) {
    return this.pessoaService.atualizar(body);
  }

  @Get('/buscar')
  atualizar(@Query() body: BuscarPessoaDto) {
    return this.pessoaService.buscar(body);
  }
}
