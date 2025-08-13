import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  EMAIL: string;
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  SENHA: string;
}

export class RegistroDto {
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  EMAIL: string;
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  SENHA: string;
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  NOME: string;
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  TELEFONE: string;
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  SOBRENOME: string;
  @ApiProperty({
    required: true,
  })
  @IsNotEmpty()
  @IsString()
  CPF: string;
}
