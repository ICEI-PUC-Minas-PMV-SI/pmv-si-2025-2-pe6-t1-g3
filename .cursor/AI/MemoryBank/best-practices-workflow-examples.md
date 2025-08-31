# Best Practices - Workflow Examples

## Exemplo de Uso - Cursor Configuration

## Cenário: Implementar Sistema de Carrinho de Compras

### 1. Gerar Tarefa (generate-task.md)

**Prompt para o Cursor:**
```
Use o template generate-task.md para criar uma tarefa de implementação do sistema de carrinho de compras no ZabbixStore. 
A tarefa deve incluir:
- Adicionar produtos ao carrinho
- Remover produtos do carrinho
- Atualizar quantidades
- Calcular total
- Persistir carrinho no localStorage
```

**Resultado esperado:** Arquivo `current-work.md` criado na raiz com estrutura RIPER.

### 2. Executar Tarefa (execute-task.md)

**Prompt para o Cursor:**
```
Use o template execute-task.md para executar as tarefas do current-work.md. 
Comece pela fase Research e execute sequencialmente.
```

**Resultado esperado:** Execução das tarefas seguindo a metodologia RIPER.

### 3. Atualizar MemoryBank (generate-memorybank.md)

**Prompt para o Cursor:**
```
Use o template generate-memorybank.md para criar um registro no Technical-context sobre a implementação do carrinho de compras.
Inclua:
- Tecnologias utilizadas (Context API, localStorage)
- Padrões implementados
- Configurações necessárias
```

**Resultado esperado:** Arquivo criado em `.cursor/AI/MemoryBank/Technical-context/`

## Exemplo de Arquivo current-work.md Gerado

```markdown
# Current Work - Sistema de Carrinho de Compras

## Objetivo
Implementar sistema completo de carrinho de compras para o ZabbixStore com funcionalidades de adicionar, remover, atualizar produtos e persistência local.

## Contexto
O sistema de carrinho é essencial para a experiência de compra do usuário, permitindo gerenciar produtos antes da finalização do pedido.

## Estrutura RIPER

### R - Research
- [ ] Analisar requisitos do sistema de carrinho
- [ ] Investigar padrões de implementação com Context API
- [ ] Estudar persistência com localStorage
- [ ] Pesquisar bibliotecas de gerenciamento de estado

### I - Implement
- [ ] Criar contexto do carrinho (CartContext)
- [ ] Implementar reducer para ações do carrinho
- [ ] Desenvolver componentes de interface
- [ ] Configurar persistência no localStorage

### P - Plan
- [ ] Definir estrutura de dados do carrinho
- [ ] Planejar fluxo de interações
- [ ] Estruturar componentes necessários

### E - Execute
- [ ] Implementar testes unitários
- [ ] Testar integração com localStorage
- [ ] Validar funcionalidades principais

### R - Review
- [ ] Code review da implementação
- [ ] Validar requisitos funcionais
- [ ] Documentar uso dos componentes

## Critérios de Aceitação
- [ ] Usuário pode adicionar produtos ao carrinho
- [ ] Usuário pode remover produtos do carrinho
- [ ] Usuário pode atualizar quantidades
- [ ] Total é calculado automaticamente
- [ ] Carrinho persiste entre sessões
- [ ] Interface é responsiva e acessível

## Estimativa de Tempo
- **Total**: 8 horas
- **Research**: 1 hora
- **Implement**: 4 horas
- **Plan**: 1 hora
- **Execute**: 1 hora
- **Review**: 1 hora

## Dependências
- Context API do React
- localStorage do navegador
- Componentes de UI existentes

## Riscos
- Performance com muitos itens no carrinho
- Sincronização entre abas do navegador
- Limitações do localStorage

## Status
- [ ] Iniciado
- [ ] Em progresso
- [ ] Concluído
- [ ] Revisado
```

## Fluxo de Trabalho Típico

### 1. Planejamento
- Definir escopo da feature
- Identificar dependências
- Estimar tempo
- Definir critérios de aceitação

### 2. Implementação
- Seguir metodologia RIPER
- Usar templates do projeto
- Documentar decisões
- Manter padrões de código

### 3. Revisão
- Code review obrigatório
- Testes automatizados
- Validação de requisitos
- Atualização do MemoryBank

### 4. Deploy
- Seguir checklist de deploy
- Verificar health checks
- Monitorar logs
- Validar funcionalidades

## Data de Criação
27/01/2025

## Última Atualização
27/01/2025
