import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';

export class AtualizarPessoaDto {
  @ApiProperty({
    description: 'ID da pessoa',
    example: 1,
  })
  @IsNumber({}, { message: 'CODPES deve ser um número' })
  @IsNotEmpty({ message: 'CODPES é obrigatório' })
  CODPES: number;

  @ApiProperty({
    description: 'Nome do usuário',
    example: 'João',
  })
  @IsString({ message: 'Nome deve ser uma string' })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  NOME: string;

  @ApiProperty({
    description: 'Sobrenome do usuário',
    example: 'Silva',
  })
  @IsString({ message: 'Sobrenome deve ser uma string' })
  @IsNotEmpty({ message: 'Sobrenome é obrigatório' })
  SOBRENOME: string;

  @ApiProperty({
    description: 'CPF do usuário (apenas números)',
    example: '12345678900',
  })
  @IsString({ message: 'CPF deve ser uma string' })
  @IsNotEmpty({ message: 'CPF é obrigatório' })
  @Matches(/^\d{11}$/, { message: 'CPF deve conter 11 dígitos numéricos' })
  CPF: string;

  @ApiProperty({
    description: 'Telefone do usuário (apenas números)',
    example: '11987654321',
  })
  @IsString({ message: 'Telefone deve ser uma string' })
  @IsNotEmpty({ message: 'Telefone é obrigatório' })
  @Matches(/^\d{10,11}$/, {
    message: 'Telefone deve conter 10 ou 11 dígitos numéricos',
  })
  TELEFONE: string;

  @ApiProperty({
    description: 'Email do usuário',
    example: 'usuario@exemplo.com',
  })
  @IsEmail({}, { message: 'Email inválido' })
  @IsOptional()
  EMAIL?: string;
}

export class BuscarPessoaDto {
  @ApiProperty({
    description: 'ID da pessoa',
    example: 1,
  })
  @IsNumber({}, { message: 'CODPES deve ser um número' })
  @IsNotEmpty({ message: 'CODPES é obrigatório' })
  CODPES: number;
}

