import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, IsOptional } from 'class-validator';

export class CadatrarEnderecoDto {
  @ApiProperty({
    required: true,
    description: 'Código da pessoa',
  })
  @IsNotEmpty()
  @IsNumber()
  CODPES: number;

  @ApiProperty({
    required: true,
    description: 'Bairro',
  })
  @IsNotEmpty()
  @IsString()
  BAIRRO: string;

  @ApiProperty({
    required: true,
    description: 'CEP',
  })
  @IsNotEmpty()
  @IsString()
  CEP: string;

  @ApiProperty({
    required: true,
    description: 'Cidade',
  })
  @IsNotEmpty()
  @IsString()
  CIDADE: string;

  @ApiProperty({
    required: true,
    description: 'Complemento',
  })
  @IsOptional()
  @IsString()
  COMPLEMENTO?: string;

  @ApiProperty({
    required: false,
    description: 'Descrição',
  })
  @IsOptional()
  @IsString()
  DESCRICAO?: string;

  @ApiProperty({
    required: true,
    description: 'Número',
  })
  @IsNotEmpty()
  @IsString()
  NUMERO: string;

  @ApiProperty({
    required: true,
    description: 'Rua',
  })
  @IsNotEmpty()
  @IsString()
  RUA: string;
}
