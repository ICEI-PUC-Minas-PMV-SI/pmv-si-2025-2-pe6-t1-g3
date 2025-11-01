import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUrl,
  Min,
} from 'class-validator';

export class CreateProductDto {
  @ApiProperty({
    description: 'Nome do produto',
    example: 'Camiseta Polo',
  })
  @IsString({ message: 'PRODUTO deve ser uma string' })
  @IsNotEmpty({ message: 'PRODUTO é obrigatório' })
  PRODUTO: string;

  @ApiProperty({
    description: 'Descrição do produto',
    example: 'Camiseta polo masculina 100% algodão',
  })
  @IsString({ message: 'DESCRICAO deve ser uma string' })
  @IsNotEmpty({ message: 'DESCRICAO é obrigatória' })
  DESCRICAO: string;

  @ApiProperty({
    description: 'URL da imagem do produto',
    example: 'https://exemplo.com/imagem.jpg',
  })
  @IsString({ message: 'IMAGEM deve ser uma string' })
  @IsUrl({}, { message: 'IMAGEM deve ser uma URL válida' })
  @IsNotEmpty({ message: 'IMAGEM é obrigatória' })
  IMAGEM: string;

  @ApiProperty({
    description: 'Quantidade em estoque',
    example: 50,
    minimum: 0,
  })
  @IsNumber({}, { message: 'ESTOQUE deve ser um número' })
  @IsNotEmpty({ message: 'ESTOQUE é obrigatório' })
  @Min(0, { message: 'ESTOQUE não pode ser negativo' })
  ESTOQUE: number;

  @ApiProperty({
    description: 'Valor do produto',
    example: 29.99,
    minimum: 0,
  })
  @IsNumber({}, { message: 'VALOR deve ser um número' })
  @IsNotEmpty({ message: 'VALOR é obrigatório' })
  @Min(0, { message: 'VALOR não pode ser negativo' })
  VALOR: number;

  @ApiProperty({
    description: 'Categoria do produto',
    example: 'MODA',
    enum: ['MODA', 'ELETRONICOS', 'CASA', 'ESPORTES'],
  })
  @IsString({ message: 'CATEGORIA deve ser uma string' })
  @IsNotEmpty({ message: 'CATEGORIA é obrigatória' })
  CATEGORIA: string;

  @ApiProperty({
    description: 'Tamanhos disponíveis (JSON)',
    example: '["P", "M", "G", "GG"]',
    required: false,
  })
  @IsString({ message: 'TAMANHOS deve ser uma string' })
  @IsOptional()
  TAMANHOS?: string;
}

export class UpdateProductDto {
  @ApiProperty({
    description: 'ID do produto',
    example: 1,
  })
  @IsNumber({}, { message: 'CODPROD deve ser um número' })
  @IsNotEmpty({ message: 'CODPROD é obrigatório' })
  CODPROD: number;

  @ApiProperty({
    description: 'Nome do produto',
    example: 'Camiseta Polo',
    required: false,
  })
  @IsString({ message: 'PRODUTO deve ser uma string' })
  @IsOptional()
  PRODUTO?: string;

  @ApiProperty({
    description: 'Descrição do produto',
    example: 'Camiseta polo masculina 100% algodão',
    required: false,
  })
  @IsString({ message: 'DESCRICAO deve ser uma string' })
  @IsOptional()
  DESCRICAO?: string;

  @ApiProperty({
    description: 'URL da imagem do produto',
    example: 'https://exemplo.com/imagem.jpg',
    required: false,
  })
  @IsString({ message: 'IMAGEM deve ser uma string' })
  @IsUrl({}, { message: 'IMAGEM deve ser uma URL válida' })
  @IsOptional()
  IMAGEM?: string;

  @ApiProperty({
    description: 'Quantidade em estoque',
    example: 50,
    minimum: 0,
    required: false,
  })
  @IsNumber({}, { message: 'ESTOQUE deve ser um número' })
  @IsOptional()
  @Min(0, { message: 'ESTOQUE não pode ser negativo' })
  ESTOQUE?: number;

  @ApiProperty({
    description: 'Valor do produto',
    example: 29.99,
    minimum: 0,
    required: false,
  })
  @IsNumber({}, { message: 'VALOR deve ser um número' })
  @IsOptional()
  @Min(0, { message: 'VALOR não pode ser negativo' })
  VALOR?: number;

  @ApiProperty({
    description: 'Categoria do produto',
    example: 'MODA',
    enum: ['MODA', 'ELETRONICOS', 'CASA', 'ESPORTES'],
    required: false,
  })
  @IsString({ message: 'CATEGORIA deve ser uma string' })
  @IsOptional()
  CATEGORIA?: string;

  @ApiProperty({
    description: 'Valor do desconto',
    example: 10.5,
    minimum: 0,
    required: false,
  })
  @IsNumber({}, { message: 'DESCONTO deve ser um número' })
  @IsOptional()
  @Min(0, { message: 'DESCONTO não pode ser negativo' })
  DESCONTO?: number;

  @ApiProperty({
    description: 'Código da categoria',
    example: 2,
    required: false,
  })
  @IsNumber({}, { message: 'CODCAT deve ser um número' })
  @IsOptional()
  CODCAT?: number;

  @ApiProperty({
    description: 'Tamanhos disponíveis (JSON)',
    example: '["P", "M", "G", "GG"]',
    required: false,
  })
  @IsString({ message: 'TAMANHOS deve ser uma string' })
  @IsOptional()
  TAMANHOS?: string;
}

export class DeleteProductDto {
  @ApiProperty({
    description: 'ID do produto',
    example: 1,
  })
  @IsNumber({}, { message: 'CODPROD deve ser um número' })
  @IsNotEmpty({ message: 'CODPROD é obrigatório' })
  CODPROD: number;
}

export class FindProductDto {
  @ApiProperty({
    description: 'ID do produto',
    example: 1,
  })
  @IsNumber({}, { message: 'CODPROD deve ser um número' })
  @IsNotEmpty({ message: 'CODPROD é obrigatório' })
  CODPROD: number;
}

export class ListProductsDto {
  @ApiProperty({
    description: 'Categoria para filtrar produtos',
    example: 'MODA',
    enum: ['MODA', 'ELETRONICOS', 'CASA', 'ESPORTES'],
    required: false,
  })
  @IsString({ message: 'CATEGORIA deve ser uma string' })
  @IsOptional()
  CATEGORIA?: string;
}
