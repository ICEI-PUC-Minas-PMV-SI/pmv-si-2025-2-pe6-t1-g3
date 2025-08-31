# ZabbixStore Domain Rules

## Regras de Negócio

### Usuários e Autenticação
1. **Cadastro de Usuário**
   - Usuários devem fornecer email válido e único
   - Senha deve ter mínimo de 8 caracteres
   - Confirmação de email é obrigatória

2. **Login e Sessão**
   - Sessões expiram após 24 horas de inatividade
   - Máximo de 3 tentativas de login por hora
   - Tokens JWT com expiração de 24 horas

### Produtos
1. **Cadastro de Produtos**
   - Produtos devem ter nome, descrição, preço e categoria
   - Preços devem ser positivos
   - Categorias devem ser pré-definidas

2. **Estoque**
   - Quantidade em estoque não pode ser negativa
   - Produtos sem estoque não podem ser adicionados ao carrinho
   - Alertas automáticos quando estoque < 10 unidades

### Pedidos
1. **Criação de Pedidos**
   - Pedidos devem ter pelo menos um item
   - Valor total deve ser calculado automaticamente
   - Status inicial: "Pendente"

2. **Status de Pedidos**
   - Pendente → Confirmado → Em Preparação → Enviado → Entregue
   - Cancelado (apenas se status = "Pendente" ou "Confirmado")

### Endereços
1. **Validação de Endereço**
   - CEP deve ser válido (formato brasileiro)
   - Endereço deve ter logradouro, número, bairro, cidade e estado
   - Endereço principal por usuário

## Regras Técnicas

### API
1. **Endpoints**
   - Todos os endpoints devem retornar status HTTP apropriados
   - Respostas de erro devem incluir mensagem descritiva
   - Paginação obrigatória para listagens

2. **Validação**
   - Validação de entrada em todos os endpoints
   - Sanitização de dados de entrada
   - Rate limiting: 100 requests/minuto por IP

### Banco de Dados
1. **Integridade**
   - Chaves estrangeiras obrigatórias
   - Índices em campos de busca frequente
   - Soft delete para entidades principais

2. **Performance**
   - Queries devem usar índices apropriados
   - Máximo de 3 joins por query
   - Timeout de 30 segundos para queries

### Frontend
1. **Interface**
   - Design responsivo (mobile-first)
   - Acessibilidade WCAG 2.1 AA
   - Loading states para todas as operações

2. **Estado**
   - Estado global com Context API
   - Persistência de carrinho no localStorage
   - Sincronização automática de dados

## Regras de Segurança

### Autenticação
1. **Senhas**
   - Hash com bcrypt (salt rounds: 12)
   - Não armazenar senhas em texto plano
   - Reset de senha via email

2. **Autorização**
   - Verificação de roles em endpoints sensíveis
   - Acesso baseado em recursos
   - Log de ações administrativas

### Dados
1. **Proteção**
   - Dados pessoais criptografados
   - Logs sem informações sensíveis
   - Backup diário automático

2. **Compliance**
   - Conformidade com LGPD
   - Consentimento explícito para marketing
   - Direito ao esquecimento

## Regras de Qualidade

### Código
1. **Padrões**
   - ESLint + Prettier para frontend
   - ESLint para backend
   - Commits com mensagens descritivas

2. **Testes**
   - Cobertura mínima de 80%
   - Testes unitários obrigatórios
   - Testes de integração para APIs

### Deploy
1. **Ambientes**
   - Desenvolvimento, Staging, Produção
   - Variáveis de ambiente por ambiente
   - Rollback automático em caso de erro

2. **Monitoramento**
   - Logs estruturados
   - Métricas de performance
   - Alertas para erros críticos
