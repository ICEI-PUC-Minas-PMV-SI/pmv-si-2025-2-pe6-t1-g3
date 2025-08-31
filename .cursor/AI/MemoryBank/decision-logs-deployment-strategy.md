# Decision Log - Deployment Strategy

## Data
27/01/2025

## Decisão
Definição da estratégia de deploy para a plataforma ZabbixStore, incluindo infraestrutura AWS, CI/CD com GitHub Actions e containerização com Docker.

## Contexto
Necessidade de uma estratégia de deploy que seja escalável, segura e adequada ao orçamento limitado do projeto, considerando que é um MVP com potencial de crescimento.

## Alternativas
1. **Infraestrutura**:
   - AWS ECS/Fargate (serverless, escalável)
   - AWS EC2 com Docker (mais controle, menor custo)
   - Heroku (simples, mais caro)

2. **CI/CD**:
   - GitHub Actions (integrado ao repositório)
   - Jenkins (mais complexo, mais flexível)
   - GitLab CI (integrado, menos popular)

3. **Banco de Dados**:
   - AWS RDS (gerenciado, mais caro)
   - PostgreSQL em container (mais barato, mais trabalho)
   - MongoDB Atlas (NoSQL, não adequado)

## Consequências
- **Esperadas**: 
  - Deploy automatizado
  - Infraestrutura escalável
  - Custos controlados
  - Segurança adequada

- **Inesperadas**: 
  - Complexidade de configuração inicial
  - Necessidade de monitoramento
  - Custos de transferência de dados

## Status
Em andamento

## Revisão
- **Data de Revisão**: 27/01/2025
- **Resultado**: Estratégia definida, implementação em progresso
- **Ações**: 
  - Configurar pipeline CI/CD
  - Implementar monitoramento
  - Documentar procedimentos de deploy
