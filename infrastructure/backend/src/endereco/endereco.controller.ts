import {
  Body,
  Controller,
  Delete,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { EnderecoService } from './endereco.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CadatrarEnderecoDto } from './dto/cadastrar-endereco.dto';
import { AtualizarEnderecoDto } from './dto/atualizar-endereco.dto';

@Controller('endereco')
@ApiTags('Endereco')
@UseGuards(AuthGuard)
@ApiBearerAuth()
export class EnderecoController {
  constructor(private readonly enderecoService: EnderecoService) {}

  @Post('/cadastrar')
  cadastrar(@Body() body: CadatrarEnderecoDto) {
    return this.enderecoService.cadastrar(body);
  }

  @Patch('/atualizar')
  atualizar(@Body() body: AtualizarEnderecoDto) {
    return this.enderecoService.atualizar(body);
  }

  @Delete('/deletar')
  deletar(@Query() body: any) {
    return this.enderecoService.deletar(body);
  }
}
