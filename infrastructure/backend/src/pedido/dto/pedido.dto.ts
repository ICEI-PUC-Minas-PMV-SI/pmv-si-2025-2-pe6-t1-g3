import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ItemPedidoDto {
  @ApiProperty({
    description: 'ID do produto',
    example: 1,
  })
  @IsNumber({}, { message: 'CODPROD deve ser um número' })
  @IsNotEmpty({ message: 'CODPROD é obrigatório' })
  CODPROD: number;

  @ApiProperty({
    description: 'Quantidade do produto',
    example: 2,
    minimum: 1,
  })
  @IsNumber({}, { message: 'QTD deve ser um número' })
  @IsNotEmpty({ message: 'QTD é obrigatória' })
  @Min(1, { message: 'QTD deve ser maior que 0' })
  QTD: number;

  @ApiProperty({
    description: 'Tamanho do produto',
    example: 'M',
    required: false,
  })
  @IsString({ message: 'TAMANHO deve ser uma string' })
  @IsOptional()
  TAMANHO?: string;
}

export class CadastrarPedidoDto {
  @ApiProperty({
    description: 'ID da pessoa',
    example: 1,
  })
  @IsNumber({}, { message: 'CODPES deve ser um número' })
  @IsNotEmpty({ message: 'CODPES é obrigatório' })
  CODPES: number;

  @ApiProperty({
    description: 'ID do endereço de entrega',
    example: 1,
  })
  @IsNumber({}, { message: 'CODEND deve ser um número' })
  @IsNotEmpty({ message: 'CODEND é obrigatório' })
  CODEND: number;

  @ApiProperty({
    description: 'Valor do desconto',
    example: 10,
    required: false,
  })
  @IsNumber({}, { message: 'DESCONTO deve ser um número' })
  @IsOptional()
  @Min(0, { message: 'DESCONTO não pode ser negativo' })
  DESCONTO?: number;

  @ApiProperty({
    description: 'Valor do frete',
    example: 15,
    required: false,
  })
  @IsNumber({}, { message: 'FRETE deve ser um número' })
  @IsOptional()
  @Min(0, { message: 'FRETE não pode ser negativo' })
  FRETE?: number;

  @ApiProperty({
    description: 'Itens do pedido',
    type: [ItemPedidoDto],
  })
  @IsArray({ message: 'ITENS deve ser um array' })
  @ValidateNested({ each: true })
  @Type(() => ItemPedidoDto)
  @IsNotEmpty({ message: 'ITENS é obrigatório' })
  ITENS: ItemPedidoDto[];
}

export class AtualizarPedidoDto {
  @ApiProperty({
    description: 'ID do pedido',
    example: 1,
  })
  @IsNumber({}, { message: 'CODPED deve ser um número' })
  @IsNotEmpty({ message: 'CODPED é obrigatório' })
  CODPED: number;

  @ApiProperty({
    description: 'Status do pedido',
    example: 'Pendente',
    required: false,
  })
  @IsString({ message: 'STATUS deve ser uma string' })
  @IsOptional()
  STATUS?: string;

  @ApiProperty({
    description: 'Itens do pedido',
    type: [ItemPedidoDto],
    required: false,
  })
  @IsArray({ message: 'ITENS deve ser um array' })
  @ValidateNested({ each: true })
  @Type(() => ItemPedidoDto)
  @IsOptional()
  ITENS?: ItemPedidoDto[];
}

export class BuscarPedidoDto {
  @ApiProperty({
    description: 'ID do pedido',
    example: 1,
  })
  @IsNumber({}, { message: 'CODPED deve ser um número' })
  @IsNotEmpty({ message: 'CODPED é obrigatório' })
  CODPED: number;
}

export class ListarPedidosDto {
  @ApiProperty({
    description: 'ID da pessoa',
    example: 1,
  })
  @IsNumber({}, { message: 'CODPES deve ser um número' })
  @IsNotEmpty({ message: 'CODPES é obrigatório' })
  CODPES: number;
}

