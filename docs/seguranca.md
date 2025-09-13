# Documentação de Segurança - Sistema E-commerce

## Objetivo

Este documento estabelece as práticas e diretrizes de segurança para proteger a aplicação distribuída em produção, garantindo confidencialidade, integridade e disponibilidade dos dados e sistemas.

## 1. Autenticação

### Métodos Implementados

#### JWT (JSON Web Tokens)
- **Algoritmo**: HS256 com secret key configurável via variável de ambiente
- **Expiração**: 24 horas por token
- **Payload**: Inclui informações essenciais do usuário (ID, email, permissões)
- **Renovação**: Implementação manual através de novo login

#### Práticas de Segurança na Autenticação
- Senhas hasheadas com bcrypt (cost factor 12)
- Normalização de email (lowercase) para evitar duplicatas
- Validação rigorosa de credenciais com mensagens genéricas de erro
- Sanitização de dados de entrada (remoção de caracteres especiais em CPF/telefone)

### Recomendações para Produção
- Implementar refresh tokens para renovação automática
- Considerar Multi-Factor Authentication (MFA) para contas administrativas
- Implementar bloqueio temporário após tentativas de login falhadas
- Utilizar OAuth2/OpenID Connect para integração com provedores externos

## 2. Autorização

### RBAC (Role-Based Access Control)

#### Roles Implementadas
- **ADMIN**: Acesso completo ao sistema, incluindo CRUD de produtos
- **CLIENTE**: Acesso limitado às funcionalidades de usuário final

#### Controle de Acesso por Endpoint
- **Públicos**: Health check, listagem/busca de produtos, autenticação
- **Autenticados**: Gestão de perfil, endereços, pedidos
- **Admin apenas**: CRUD completo de produtos

#### Guards Implementados
- **AuthGuard**: Verificação de token JWT válido
- **RolesGuard**: Verificação de permissões específicas por role
- **Public Decorator**: Bypass de autenticação para endpoints públicos

### Recomendações para Expansão
- Implementar ABAC (Attribute-Based Access Control) para cenários complexos
- Adicionar roles intermediárias (MODERADOR, VENDEDOR)
- Implementar permissões granulares por recurso

## 3. Proteção contra Ataques Comuns

### SQL Injection
- **Proteção**: Uso exclusivo do ORM Prisma com queries parametrizadas
- **Validação**: Class-validator para sanitização de entrada
- **Monitoramento**: Logs de queries suspeitas

### Cross-Site Scripting (XSS)
- **Helmet.js**: Headers de segurança HTTP configurados
- **CSP**: Content Security Policy restritiva para scripts e imagens
- **Sanitização**: Validação e transformação automática de dados

### Cross-Site Request Forgery (CSRF)
- **CORS**: Configuração restritiva para origens permitidas
- **SameSite Cookies**: Configuração adequada para cookies de sessão
- **Token Validation**: Verificação obrigatória de JWT em operações sensíveis

### Brute Force
- **Rate Limiting**: Implementação via NestJS Throttler
- **Account Lockout**: Bloqueio temporário após tentativas falhadas
- **Monitoring**: Alertas para padrões suspeitos de acesso

### DDoS
- **Rate Limiting**: Proteção a nível de aplicação
- **Load Balancing**: Distribuição de carga entre instâncias
- **CDN**: Uso de Content Delivery Network para recursos estáticos
- **Firewall**: WAF (Web Application Firewall) em produção

## 4. Comunicação Segura

### HTTPS/TLS
- **Obrigatório**: Todas as comunicações devem usar HTTPS em produção
- **Certificados**: SSL/TLS com certificados válidos
- **HSTS**: HTTP Strict Transport Security habilitado
- **Cipher Suites**: Configuração de algoritmos criptográficos seguros

### Configuração CORS
```typescript
app.enableCors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
});
```

## 5. Gestão de Credenciais e Segredos

### Variáveis de Ambiente
- **JWT_SECRET**: Secret key para assinatura de tokens
- **DATABASE_URL**: String de conexão com banco de dados
- **FRONTEND_URL**: URL permitida para CORS

### Recomendações para Produção
- **AWS Secrets Manager**: Armazenamento seguro de credenciais
- **Rotação Automática**: Rotação periódica de secrets
- **Principle of Least Privilege**: Acesso mínimo necessário
- **Encryption at Rest**: Criptografia de dados sensíveis no banco

### Boas Práticas
- Nunca commitar secrets no repositório
- Usar arquivos .env.example como template
- Implementar validação de configuração na inicialização
- Logging seguro sem exposição de credenciais

## 6. Logs e Auditoria

### Implementação Atual
- Logs estruturados via NestJS Logger
- Registro de tentativas de autenticação
- Monitoramento de health checks
- Exception logging com stack traces

### Eventos a Auditar
- Tentativas de login (sucesso/falha)
- Operações administrativas (CRUD produtos)
- Mudanças de senha
- Acessos a endpoints sensíveis
- Tentativas de acesso negadas

### Recomendações para Produção
- **Centralização**: ELK Stack ou similar para agregação
- **Retention Policy**: Política de retenção de logs
- **Alertas**: Notificações para eventos suspeitos
- **SIEM**: Security Information and Event Management
- **Compliance**: Conformidade com LGPD/GDPR

## 7. Atualizações e Patches

### Gestão de Dependências
- **Package.json**: Dependências com versões específicas
- **Audit Regular**: npm audit para vulnerabilidades conhecidas
- **Automated Updates**: Ferramentas como Dependabot
- **Testing**: Testes automatizados antes de deploy

### Monitoramento de Vulnerabilidades
- Snyk ou similar para scanning contínuo
- CVE monitoring para bibliotecas críticas
- Patch management com janelas de manutenção
- Rollback strategy para updates problemáticos

## 8. Hardening do Ambiente

### Configuração de Servidor
- Remoção de serviços desnecessários
- Firewall configurado (apenas portas necessárias)
- Usuários com privilégios mínimos
- Patches de SO atualizados regularmente

### Banco de Dados
- Usuário específico com permissões limitadas
- Conexões criptografadas
- Backup regular e testado
- Network isolation (VPC/Subnet privada)

### Containers (Docker)
- Imagens base minimalistas
- Non-root user para execução
- Multi-stage builds para reduzir attack surface
- Scanning de vulnerabilidades em imagens

### Variáveis de Ambiente de Produção
```bash
# Essenciais para segurança
NODE_ENV=production
JWT_SECRET=<strong-random-secret>
DATABASE_URL=<encrypted-connection-string>
FRONTEND_URL=https://yourdomain.com
```

## 9. Monitoramento e Resposta a Incidentes

### Métricas de Segurança
- Taxa de tentativas de autenticação falhadas
- Padrões anômalos de acesso
- Performance de endpoints críticos
- Uso de recursos do sistema

### Plano de Resposta
1. **Detecção**: Alertas automáticos para eventos críticos
2. **Investigação**: Análise de logs e evidências
3. **Contenção**: Isolamento de sistemas comprometidos
4. **Erradicação**: Remoção de ameaças identificadas
5. **Recuperação**: Restauração de serviços seguros
6. **Lições Aprendidas**: Melhoria contínua dos processos

## 10. Conformidade e Compliance

### LGPD (Lei Geral de Proteção de Dados)
- Consentimento explícito para coleta de dados
- Direito ao esquecimento (exclusão de dados)
- Portabilidade de dados
- Notificação de vazamentos

### Boas Práticas Gerais
- Privacy by Design
- Data minimization
- Criptografia de dados sensíveis
- Auditoria regular de acessos
- Treinamento da equipe em segurança

## Conclusão

Esta documentação estabelece as bases para um sistema seguro e resiliente. É fundamental que todas as práticas aqui descritas sejam implementadas e mantidas atualizadas conforme a evolução das ameaças e dos requisitos de negócio.

### Próximos Passos
1. Implementação de MFA para contas administrativas
2. Configuração de WAF em produção
3. Implementação de refresh tokens
4. Setup de monitoramento centralizado
5. Testes de penetração regulares