# Decision Log - Database Design and Schema

## Data
27/01/2025

## Decisão
Definição do schema do banco de dados PostgreSQL para a plataforma ZabbixStore, incluindo estrutura de tabelas, relacionamentos e nomenclatura.

## Contexto
Necessidade de modelar dados para suportar usuários (fornecedores e compradores), produtos, pedidos, endereços e categorias, mantendo integridade referencial e performance adequada.

## Alternativas
1. **Nomenclatura**:
   - CamelCase (padrão JavaScript)
   - snake_case (padrão SQL)
   - UPPERCASE (padrão legado)

2. **Estrutura de Usuários**:
   - Tabela única com discriminator
   - Tabelas separadas para fornecedores e compradores
   - Tabela de login separada da tabela de dados pessoais

3. **Relacionamentos**:
   - Relacionamentos diretos entre todas as tabelas
   - Uso de tabelas intermediárias
   - Normalização vs. Desnormalização

## Consequências
- **Esperadas**: 
  - Estrutura clara e organizada
  - Relacionamentos bem definidos
  - Suporte a diferentes tipos de usuário
  - Facilidade de manutenção

- **Inesperadas**: 
  - Complexidade de queries com múltiplos joins
  - Necessidade de índices para performance
  - Migrações complexas para mudanças de schema

## Status
Implementada

## Revisão
- **Data de Revisão**: 27/01/2025
- **Resultado**: Schema atende aos requisitos funcionais
- **Ações**: 
  - Implementar índices para otimização
  - Configurar backup automático
  - Documentar queries complexas
