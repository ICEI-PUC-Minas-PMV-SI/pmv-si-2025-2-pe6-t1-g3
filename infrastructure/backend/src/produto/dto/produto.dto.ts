import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsNumber,
  IsOptional,
  Min,
  MaxLength,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @ApiProperty({
    description: 'Nome do produto',
    example: 'Camiseta Polo',
    required: true,
  })
  @IsNotEmpty({ message: 'Nome do produto é obrigatório' })
  @IsString()
  @MaxLength(100, {
    message: 'Nome do produto deve ter no máximo 100 caracteres',
  })
  PRODUTO: string;

  @ApiProperty({
    description: 'Descrição do produto',
    example: 'Camiseta polo masculina 100% algodão',
    required: true,
  })
  @IsNotEmpty({ message: 'Descrição é obrigatória' })
  @IsString()
  @MaxLength(500, { message: 'Descrição deve ter no máximo 500 caracteres' })
  DESCRICAO: string;

  @ApiProperty({
    description: 'URL da imagem do produto',
    example: 'https://exemplo.com/imagem.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255, {
    message: 'URL da imagem deve ter no máximo 255 caracteres',
  })
  IMAGEM?: string;

  @ApiProperty({
    description: 'Preço do produto',
    example: 29.99,
    required: true,
  })
  @IsNotEmpty({ message: 'Preço é obrigatório' })
  @IsNumber({}, { message: 'Preço deve ser um número' })
  @Type(() => Number)
  @Min(0.01, { message: 'Preço deve ser maior que zero' })
  VALOR: number;

  @ApiProperty({
    description: 'Quantidade em estoque',
    example: 50,
    required: true,
  })
  @IsNotEmpty({ message: 'Estoque é obrigatório' })
  @IsNumber({}, { message: 'Estoque deve ser um número' })
  @Type(() => Number)
  @Min(0, { message: 'Estoque não pode ser negativo' })
  ESTOQUE: number;

  @ApiProperty({
    description: 'Categoria do produto',
    example: 'MASCULINO',
    enum: ['MASCULINO', 'FEMININO'],
    required: true,
  })
  @IsNotEmpty({ message: 'Categoria é obrigatória' })
  @IsString()
  @IsIn(['MASCULINO', 'FEMININO'], {
    message: 'Categoria deve ser MASCULINO ou FEMININO',
  })
  CATEGORIA: string;

  @ApiProperty({
    description: 'Desconto em porcentagem',
    example: 10.5,
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Desconto deve ser um número' })
  @Type(() => Number)
  @Min(0, { message: 'Desconto não pode ser negativo' })
  DESCONTO?: number;
}

export class UpdateProductDto {
  @ApiProperty({
    description: 'ID do produto',
    example: 1,
    required: true,
  })
  @IsNotEmpty({ message: 'ID do produto é obrigatório' })
  @IsNumber({}, { message: 'ID deve ser um número' })
  @Type(() => Number)
  CODPROD: number;

  @ApiProperty({
    description: 'Nome do produto',
    example: 'Camiseta Polo',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100, {
    message: 'Nome do produto deve ter no máximo 100 caracteres',
  })
  PRODUTO?: string;

  @ApiProperty({
    description: 'Descrição do produto',
    example: 'Camiseta polo masculina 100% algodão',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Descrição deve ter no máximo 500 caracteres' })
  DESCRICAO?: string;

  @ApiProperty({
    description: 'URL da imagem do produto',
    example: 'https://exemplo.com/imagem.jpg',
    required: false,
  })
  @IsOptional()
  @IsString()
  @MaxLength(255, {
    message: 'URL da imagem deve ter no máximo 255 caracteres',
  })
  IMAGEM?: string;

  @ApiProperty({
    description: 'Preço do produto',
    example: 29.99,
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Preço deve ser um número' })
  @Type(() => Number)
  @Min(0.01, { message: 'Preço deve ser maior que zero' })
  VALOR?: number;

  @ApiProperty({
    description: 'Quantidade em estoque',
    example: 50,
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Estoque deve ser um número' })
  @Type(() => Number)
  @Min(0, { message: 'Estoque não pode ser negativo' })
  ESTOQUE?: number;

  @ApiProperty({
    description: 'Categoria do produto',
    example: 'MASCULINO',
    enum: ['MASCULINO', 'FEMININO'],
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsIn(['MASCULINO', 'FEMININO'], {
    message: 'Categoria deve ser MASCULINO ou FEMININO',
  })
  CATEGORIA?: string;

  @ApiProperty({
    description: 'Desconto em porcentagem',
    example: 10.5,
    required: false,
  })
  @IsOptional()
  @IsNumber({}, { message: 'Desconto deve ser um número' })
  @Type(() => Number)
  @Min(0, { message: 'Desconto não pode ser negativo' })
  DESCONTO?: number;
}
