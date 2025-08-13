import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CadatrarEnderecoDto {
  @ApiProperty({
    required: true,
    description: 'Código da pessoa',
  })
  @IsNotEmpty()
  @IsNumber()
  CODPES: string;

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
  @IsNotEmpty()
  @IsString()
  COMPLEMENTO: string;

  @ApiProperty({
    required: true,
    description: 'Descrição',
  })
  @IsNotEmpty()
  @IsString()
  DESCRICAO: string;

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
