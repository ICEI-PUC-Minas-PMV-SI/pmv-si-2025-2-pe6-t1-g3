import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  Matches,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class LoginDto {
  @ApiProperty({
    description: 'Email do usuário',
    example: 'usuario@exemplo.com',
  })
  @IsEmail({}, { message: 'Email inválido' })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  EMAIL: string;

  @ApiProperty({
    description: 'Senha do usuário',
    example: 'Senha@123',
    minLength: 8,
  })
  @IsString({ message: 'Senha deve ser uma string' })
  @MinLength(8, { message: 'Senha deve ter no mínimo 8 caracteres' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
    {
      message:
        'Senha deve conter pelo menos uma letra maiúscula, uma minúscula, um número e um caractere especial',
    },
  )
  SENHA: string;
}

export class EnderecoRegistroDto {
  @ApiProperty({
    description: 'Descrição do endereço (ex: Casa, Trabalho)',
    example: 'Casa',
  })
  @IsString({ message: 'Descrição deve ser uma string' })
  @IsNotEmpty({ message: 'Descrição é obrigatória' })
  DESCRICAO: string;

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

export class RegistroDto extends LoginDto {
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
    description: 'Endereço do usuário (opcional)',
    type: EnderecoRegistroDto,
    required: false,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => EnderecoRegistroDto)
  ENDERECO?: EnderecoRegistroDto;
}

export class ChangePasswordDto {
  @ApiProperty({
    description: 'Senha atual do usuário',
    example: 'Senha@123',
  })
  @IsString({ message: 'Senha atual deve ser uma string' })
  @IsNotEmpty({ message: 'Senha atual é obrigatória' })
  oldPassword: string;

  @ApiProperty({
    description: 'Nova senha do usuário',
    example: 'NovaSenha@123',
    minLength: 8,
  })
  @IsString({ message: 'Nova senha deve ser uma string' })
  @MinLength(8, { message: 'Nova senha deve ter no mínimo 8 caracteres' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/,
    {
      message:
        'Nova senha deve conter pelo menos uma letra maiúscula, uma minúscula, um número e um caractere especial',
    },
  )
  newPassword: string;
}

export class ValidateTokenDto {
  @ApiProperty({
    description: 'Token JWT',
    example: 'eyJhbGciOiJIUzI1NiIs...',
  })
  @IsString({ message: 'Token deve ser uma string' })
  @IsNotEmpty({ message: 'Token é obrigatório' })
  token: string;
}
