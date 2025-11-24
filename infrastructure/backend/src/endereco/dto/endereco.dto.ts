import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class CadastrarEnderecoDto {
  @ApiProperty({
    description: 'ID da pessoa',
    example: 1,
  })
  @IsNumber({}, { message: 'CODPES deve ser um número' })
  @IsOptional({ message: 'CODPES é opcional' })
  CODPES: number;

  @ApiProperty({
    description: 'Descrição do endereço (ex: Casa, Trabalho)',
    example: 'Casa',
  })
  @IsString({ message: 'Descrição deve ser uma string' })
  @IsOptional()
  DESCRICAO?: string;

  @ApiProperty({
    description: 'CEP (apenas números)',
    example: '12345678',
  })
  @IsString({ message: 'CEP deve ser uma string' })
  @IsNotEmpty({ message: 'CEP é obrigatório' })
  @Matches(/^\d{8}$/, { message: 'CEP deve conter 8 dígitos numéricos' })
  CEP: string;

  @ApiProperty({
    description: 'Nome da rua',
    example: 'Rua das Flores',
  })
  @IsString({ message: 'Rua deve ser uma string' })
  @IsNotEmpty({ message: 'Rua é obrigatória' })
  RUA: string;

  @ApiProperty({
    description: 'Número do endereço',
    example: '123',
  })
  @IsString({ message: 'Número deve ser uma string' })
  @IsNotEmpty({ message: 'Número é obrigatório' })
  NUMERO: string;

  @ApiProperty({
    description: 'Complemento do endereço',
    example: 'Apto 42',
    required: false,
  })
  @IsString({ message: 'Complemento deve ser uma string' })
  @IsOptional()
  COMPLEMENTO?: string;

  @ApiProperty({
    description: 'Bairro',
    example: 'Centro',
  })
  @IsString({ message: 'Bairro deve ser uma string' })
  @IsNotEmpty({ message: 'Bairro é obrigatório' })
  BAIRRO: string;

  @ApiProperty({
    description: 'Cidade',
    example: 'São Paulo',
  })
  @IsString({ message: 'Cidade deve ser uma string' })
  @IsNotEmpty({ message: 'Cidade é obrigatória' })
  CIDADE: string;
}

export class AtualizarEnderecoDto extends CadastrarEnderecoDto {
  @ApiProperty({
    description: 'ID do endereço',
    example: 1,
  })
  @IsNumber({}, { message: 'CODEND deve ser um número' })
  @IsNotEmpty({ message: 'CODEND é obrigatório' })
  CODEND: number;
}

export class DeletarEnderecoDto {
  @ApiProperty({
    description: 'ID do endereço',
    example: 1,
  })
  @IsNumber({}, { message: 'CODEND deve ser um número' })
  @IsNotEmpty({ message: 'CODEND é obrigatório' })
  CODEND: number;
}
