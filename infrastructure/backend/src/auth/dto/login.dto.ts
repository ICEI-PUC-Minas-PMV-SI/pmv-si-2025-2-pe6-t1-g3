import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  Matches,
  IsObject,
  IsOptional,
} from 'class-validator';
import { CadastrarEnderecoDto } from 'src/endereco/dto/endereco.dto';

export class LoginDto {
  @ApiProperty({
    description: 'Email do usuário',
    example: 'usuario@exemplo.com',
    required: true,
  })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  @IsEmail({}, { message: 'Email deve ter um formato válido' })
  EMAIL: string;

  @ApiProperty({
    description: 'Senha do usuário',
    example: 'senhaSegura123',
    required: true,
  })
  @IsNotEmpty({ message: 'Senha é obrigatória' })
  @IsString()
  @MinLength(6, { message: 'Senha deve ter pelo menos 6 caracteres' })
  SENHA: string;
}

export class RegistroDto {
  @ApiProperty({
    description: 'Email do usuário',
    example: 'usuario@exemplo.com',
    required: true,
  })
  @IsNotEmpty({ message: 'Email é obrigatório' })
  @IsEmail({}, { message: 'Email deve ter um formato válido' })
  EMAIL: string;

  @ApiProperty({
    description: 'Senha do usuário',
    example: 'senhaSegura123',
    required: true,
  })
  @IsNotEmpty({ message: 'Senha é obrigatória' })
  @IsString()
  @MinLength(8, { message: 'Senha deve ter pelo menos 8 caracteres' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message:
      'Senha deve conter pelo menos uma letra minúscula, uma maiúscula e um número',
  })
  SENHA: string;

  @ApiProperty({
    description: 'Nome do usuário',
    example: 'João',
    required: true,
  })
  @IsNotEmpty({ message: 'Nome é obrigatório' })
  @IsString()
  @MaxLength(50, { message: 'Nome deve ter no máximo 50 caracteres' })
  NOME: string;

  @ApiProperty({
    description: 'Sobrenome do usuário',
    example: 'Silva',
    required: true,
  })
  @IsNotEmpty({ message: 'Sobrenome é obrigatório' })
  @IsString()
  @MaxLength(50, { message: 'Sobrenome deve ter no máximo 50 caracteres' })
  SOBRENOME: string;

  @ApiProperty({
    description: 'CPF do usuário (apenas números)',
    example: '12345678900',
    required: true,
  })
  @IsNotEmpty({ message: 'CPF é obrigatório' })
  @IsString()
  @Matches(/^\d{11}$/, { message: 'CPF deve conter exatamente 11 dígitos' })
  CPF: string;

  @ApiProperty({
    description: 'Telefone do usuário (apenas números)',
    example: '11987654321',
    required: true,
  })
  @IsNotEmpty({ message: 'Telefone é obrigatório' })
  @IsString()
  @Matches(/^\d{10,11}$/, { message: 'Telefone deve conter 10 ou 11 dígitos' })
  TELEFONE: string;

  @ApiProperty({
    description: 'Endereço do usuário',
    example: 'Rua das Flores, 123',
    required: true,
  })
  @IsOptional({ message: 'Endereço é obrigatório' })
  @IsObject()
  ENDERECO: CadastrarEnderecoDto;
}

export class ChangePasswordDto {
  @ApiProperty({
    description: 'Senha atual do usuário',
    required: true,
  })
  @IsNotEmpty({ message: 'Senha atual é obrigatória' })
  @IsString()
  oldPassword: string;

  @ApiProperty({
    description: 'Nova senha do usuário',
    required: true,
  })
  @IsNotEmpty({ message: 'Nova senha é obrigatória' })
  @IsString()
  @MinLength(8, { message: 'Nova senha deve ter pelo menos 8 caracteres' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message:
      'Nova senha deve conter pelo menos uma letra minúscula, uma maiúscula e um número',
  })
  newPassword: string;
}
