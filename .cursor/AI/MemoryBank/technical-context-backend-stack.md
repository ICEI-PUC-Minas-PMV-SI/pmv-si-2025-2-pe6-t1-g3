# Technical Context - Backend Stack

## Tecnologia
- **Nome**: NestJS
- **Versão**: ^10.0.0
- **Propósito**: Framework Node.js para construção de APIs robustas e escaláveis

## Configuração
```json
{
  "dependencies": {
    "@nestjs/common": "^10.0.0",
    "@nestjs/config": "^3.2.0",
    "@nestjs/core": "^10.0.0",
    "@nestjs/jwt": "^10.2.0",
    "@nestjs/platform-express": "^10.0.0",
    "@nestjs/swagger": "^7.3.0",
    "@nestjs/throttler": "^5.0.0",
    "@prisma/client": "^5.11.0",
    "bcrypt": "^5.1.1",
    "class-transformer": "^0.5.1",
    "class-validator": "^0.14.1",
    "helmet": "^7.1.0",
    "jsonwebtoken": "^9.0.2"
  }
}
```

## Padrões de Uso
- Arquitetura modular com decorators
- Injeção de dependências
- Validação de dados com class-validator
- Documentação automática com Swagger
- Rate limiting com @nestjs/throttler
- Segurança com helmet

## Dependências
- Node.js 18+
- TypeScript 5.1+
- PostgreSQL (banco de dados)
- Prisma ORM (mapeamento objeto-relacional)

## Exemplos de Implementação
```typescript
// Controller com autenticação
@Controller('auth')
@UseGuards(AuthGuard)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @Public()
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }
}

// Service com validação
@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async createProduct(createProductDto: CreateProductDto) {
    return this.prisma.produtos.create({
      data: createProductDto
    });
  }
}
```

## Melhores Práticas
- Usar decorators para validação e autorização
- Implementar interceptors para logging e transformação
- Utilizar guards para proteção de rotas
- Seguir princípios SOLID
- Documentar APIs com Swagger
- Implementar tratamento de erros global

## Data de Criação
27/01/2025

## Última Atualização
27/01/2025
