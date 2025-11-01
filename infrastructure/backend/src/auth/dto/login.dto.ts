import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { CadastrarEnderecoDto } from 'src/endereco/dto/endereco.dto';

export class LoginDto {
  @ApiProperty({
    description: 'Email do usuario',
    example: 'usuario@exemplo.com',
    required: true,
  })
  @IsNotEmpty({ message: 'Email e obrigatorio' })
  @IsEmail({}, { message: 'Email deve ter um formato valido' })
  EMAIL: string;

  @ApiProperty({
    description: 'Senha do usuario',
    example: 'senhaSegura123',
    required: true,
  })
  @IsNotEmpty({ message: 'Senha e obrigatoria' })
  @IsString()
  @MinLength(6, { message: 'Senha deve ter pelo menos 6 caracteres' })
  SENHA: string;
}

export class GoogleLoginDto {
  @ApiProperty({
    description: 'Credencial (ID token) retornada pelo Google Identity Services',
    required: true,
  })
  @IsNotEmpty({ message: 'Credencial do Google e obrigatoria' })
  @IsString()
  credential: string;
}

export class RegistroDto {
  @ApiProperty({
    description: 'Email do usuario',
    example: 'usuario@exemplo.com',
    required: true,
  })
  @IsNotEmpty({ message: 'Email e obrigatorio' })
  @IsEmail({}, { message: 'Email deve ter um formato valido' })
  EMAIL: string;

  @ApiProperty({
    description: 'Senha do usuario',
    example: 'senhaSegura123',
    required: true,
  })
  @IsNotEmpty({ message: 'Senha e obrigatoria' })
  @IsString()
  @MinLength(8, { message: 'Senha deve ter pelo menos 8 caracteres' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message:
      'Senha deve conter pelo menos uma letra minuscula, uma maiuscula e um numero',
  })
  SENHA: string;

  @ApiProperty({
    description: 'Nome do usuario',
    example: 'Joao',
    required: true,
  })
  @IsNotEmpty({ message: 'Nome e obrigatorio' })
  @IsString()
  @MaxLength(50, { message: 'Nome deve ter no maximo 50 caracteres' })
  NOME: string;

  @ApiProperty({
    description: 'Sobrenome do usuario',
    example: 'Silva',
    required: true,
  })
  @IsNotEmpty({ message: 'Sobrenome e obrigatorio' })
  @IsString()
  @MaxLength(50, { message: 'Sobrenome deve ter no maximo 50 caracteres' })
  SOBRENOME: string;

  @ApiProperty({
    description: 'CPF do usuario (apenas numeros)',
    example: '12345678900',
    required: true,
  })
  @IsNotEmpty({ message: 'CPF e obrigatorio' })
  @IsString()
  @Matches(/^\d{11}$/, { message: 'CPF deve conter exatamente 11 digitos' })
  CPF: string;

  @ApiProperty({
    description: 'Telefone do usuario (apenas numeros)',
    example: '11987654321',
    required: true,
  })
  @IsNotEmpty({ message: 'Telefone e obrigatorio' })
  @IsString()
  @Matches(/^\d{10,11}$/, {
    message: 'Telefone deve conter 10 ou 11 digitos',
  })
  TELEFONE: string;

  @ApiProperty({
    description: 'Endereco do usuario',
    example: 'Rua das Flores, 123',
    required: true,
  })
  @IsOptional({ message: 'Endereco nao e obrigatorio' })
  @IsObject()
  ENDERECO: CadastrarEnderecoDto;
}

export class ChangePasswordDto {
  @ApiProperty({
    description: 'Senha atual do usuario',
    required: true,
  })
  @IsNotEmpty({ message: 'Senha atual e obrigatoria' })
  @IsString()
  oldPassword: string;

  @ApiProperty({
    description: 'Nova senha do usuario',
    required: true,
  })
  @IsNotEmpty({ message: 'Nova senha e obrigatoria' })
  @IsString()
  @MinLength(8, { message: 'Nova senha deve ter pelo menos 8 caracteres' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message:
      'Nova senha deve conter pelo menos uma letra minuscula, uma maiuscula e um numero',
  })
  newPassword: string;
}
