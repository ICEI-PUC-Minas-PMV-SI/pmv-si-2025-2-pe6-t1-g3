# Execute Task Prompt Template

<description>
Executar as tarefas definidas no arquivo `current-work.md` seguindo a metodologia RIPER e as melhores práticas do projeto.
</description>

<projectContext>
- **Nome do Projeto**: ZabbixStore
- **Tecnologias**: React, Node.js, NestJS, Prisma, PostgreSQL
- **Arquitetura**: Frontend (React), Backend (NestJS), Banco de Dados (PostgreSQL)
</projectContext>

<executionFlow>
### 1. Leitura e Análise
- Ler o arquivo `current-work.md` na raiz do projeto
- Identificar a fase atual (R, I, P, E, R)
- Verificar dependências e pré-requisitos

### 2. Execução Sequencial
- Executar tarefas na ordem definida
- Seguir a metodologia RIPER
- Documentar progresso

### 3. Validação
- Verificar critérios de aceitação
- Executar testes quando aplicável
- Validar integração
</executionFlow>

<phaseStrategies>
## Estratégias por Fase

### R - Research
- Analisar documentação existente
- Investigar tecnologias e padrões
- Consultar MemoryBank para contexto

### I - Implement
- Desenvolver código seguindo padrões do projeto
- Implementar testes unitários
- Configurar dependências

### P - Plan
- Definir arquitetura detalhada
- Estruturar dados e APIs
- Planejar cronograma de execução

### E - Execute
- Executar testes automatizados
- Configurar ambiente de deploy
- Validar integração entre componentes

### R - Review
- Realizar code review
- Validar requisitos funcionais
- Atualizar documentação
</phaseStrategies>



<executionTemplate>
```markdown
# Execução de Tarefa - [NOME_DA_TAREFA]

## Status Atual
- **Fase**: [R/I/P/E/R]
- **Progresso**: [X/Y] tarefas concluídas
- **Próxima Ação**: [Descrição da próxima tarefa]

## Execução Detalhada

### Tarefa Atual: [Nome da Sub-tarefa]
- **Objetivo**: [Descrição]
- **Ações Realizadas**:
  - [ ] [Ação 1]
  - [ ] [Ação 2]
  - [ ] [Ação 3]

### Próximas Ações
- [ ] [Próxima sub-tarefa 1]
- [ ] [Próxima sub-tarefa 2]

## Log de Execução
- **Data/Hora**: [Timestamp]
- **Ação**: [Descrição da ação]
- **Resultado**: [Sucesso/Erro/Em andamento]
- **Observações**: [Detalhes importantes]

## Problemas Encontrados
- [ ] [Problema 1] - [Status da resolução]
- [ ] [Problema 2] - [Status da resolução]

## Próximos Passos
1. [Próximo passo 1]
2. [Próximo passo 2]
3. [Próximo passo 3]
```
</executionTemplate>

<usageInstructions>
1. Localizar e ler o arquivo `current-work.md` na raiz do projeto
2. Identificar a fase atual (R/I/P/E/R) e próxima tarefa a ser executada
3. Executar a tarefa seguindo as melhores práticas do projeto
4. Documentar progresso e atualizar status no arquivo `current-work.md`
5. Validar critérios de aceitação após cada fase
6. Consultar MemoryBank quando necessário para contexto técnico
7. Se encontrar problemas, documentar no arquivo `current-work.md` na seção apropriada
8. Continuar execução sequencial até completar todas as fases RIPER
</usageInstructions>

<memoryBankIntegration>
## Integração com MemoryBank
- Consultar `Business-context` para regras de negócio
- Verificar `Technical-context` para padrões técnicos
- Revisar `Architeture-patterns` para decisões arquiteturais
- Registrar decisões importantes em `Decision-logs`
</memoryBankIntegration>
