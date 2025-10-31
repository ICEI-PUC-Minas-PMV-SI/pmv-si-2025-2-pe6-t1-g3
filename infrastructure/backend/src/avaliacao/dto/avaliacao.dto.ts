import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateAvaliacaoDto {
  @ApiProperty({
    description: 'Código do produto a ser avaliado',
    example: 1,
  })
  @IsInt()
  CODPROD: number;

  @ApiProperty({
    description: 'Nota da avaliação (1 a 5 estrelas)',
    example: 5,
    minimum: 1,
    maximum: 5,
  })
  @IsInt()
  @Min(1, { message: 'A nota deve ser no mínimo 1' })
  @Max(5, { message: 'A nota deve ser no máximo 5' })
  NOTA: number;

  @ApiProperty({
    description: 'Comentário sobre o produto (opcional)',
    example: 'Excelente produto, superou minhas expectativas!',
    required: false,
  })
  @IsOptional()
  @IsString()
  COMENTARIO?: string;
}

export class ListAvaliacoesDto {
  @ApiProperty({
    description: 'Código do produto para listar avaliações',
    example: 1,
  })
  @IsInt()
  CODPROD: number;
}
