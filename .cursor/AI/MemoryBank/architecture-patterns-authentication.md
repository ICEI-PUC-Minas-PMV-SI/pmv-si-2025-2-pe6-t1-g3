# Architecture Pattern - JWT Authentication

## Decisão
Implementação de autenticação baseada em JWT (JSON Web Tokens) para a plataforma ZabbixStore, garantindo segurança e escalabilidade.

## Contexto
Necessidade de um sistema de autenticação que suporte diferentes tipos de usuários (fornecedores e compradores) com diferentes níveis de permissão, mantendo a sessão do usuário e permitindo acesso seguro aos recursos da aplicação.

## Alternativas Consideradas
1. **Session-based Authentication**
   - Prós: Simples de implementar, fácil de invalidar
   - Contras: Armazenamento no servidor, não escalável, dependência de cookies
   - Por que não foi escolhida: Limitações de escalabilidade e complexidade de gerenciamento

2. **OAuth 2.0**
   - Prós: Padrão robusto, suporte a terceiros
   - Contras: Complexidade de implementação, overhead
   - Por que não foi escolhida: Complexidade desnecessária para o contexto atual

3. **API Keys**
   - Prós: Simples, rápido
   - Contras: Segurança limitada, difícil de revogar
   - Por que não foi escolhida: Não adequado para autenticação de usuários

## Solução Escolhida
JWT Authentication com:
- **Token Structure**: Header.Payload.Signature
- **Secret Key**: Configurável via variável de ambiente
- **Expiration**: Tokens com tempo de expiração
- **Refresh Tokens**: Para renovação automática
- **Role-based Access**: Diferentes permissões por tipo de usuário

## Implementação
```typescript
// JWT Strategy
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    return {
      userId: payload.sub,
      email: payload.email,
      permission: payload.permission,
    };
  }
}

// Auth Guard
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    
    if (!token) {
      throw new UnauthorizedException();
    }
    
    try {
      const payload = this.jwtService.verify(token);
      request['user'] = payload;
    } catch {
      throw new UnauthorizedException();
    }
    
    return true;
  }
}

// Role-based Guard
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (!requiredRoles) {
      return true;
    }
    
    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.some((role) => user.permission?.includes(role));
  }
}
```

## Impactos
- **Positivos**: 
  - Stateless authentication
  - Escalabilidade horizontal
  - Flexibilidade de implementação
  - Suporte a diferentes clientes
  - Performance otimizada

- **Negativos**: 
  - Tokens não podem ser invalidados antes da expiração
  - Tamanho do token pode ser grande
  - Necessidade de gerenciar refresh tokens

- **Riscos**: 
  - Comprometimento do secret key
  - Tokens expirados em uso
  - Armazenamento inseguro no cliente

## Data da Decisão
27/01/2025

## Responsável
Equipe de Segurança - ZabbixStore
