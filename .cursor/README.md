# 📚 Guidelines - ZabbixStore

Este diretório contém as **guidelines práticas** para desenvolvimento e operação do projeto ZabbixStore. Para documentação contextual e explicativa, consulte o [MemoryBank](../AI/MemoryBank/).

## 🎯 Propósito

As guidelines focam em **comandos práticos** e **instruções operacionais** para desenvolvimento diário, troubleshooting e deploy.

## 📁 Estrutura

### 🛠️ Desenvolvimento
- **[development-guidelines.md](./development-guidelines.md)** - Comandos práticos para desenvolvimento
- **[quick-reference.md](./quick-reference.md)** - Referência rápida dos comandos mais usados
- **[troubleshooting.md](./troubleshooting.md)** - Soluções para problemas comuns

### 🚀 Deploy e Operação
- **[deployment-checklist.md](./deployment-checklist.md)** - Checklist completo de deploy
- **[docker-guidelines.md](./docker-guidelines.md)** - Comandos Docker específicos
- **[api-guidelines.md](./api-guidelines.md)** - Padrões de API

### 🗄️ Banco de Dados
- **[database-guidelines.md](./database-guidelines.md)** - Comandos e configurações do banco

### 🔒 Segurança
- **[security.md](./security.md)** - Configurações de segurança

## 🚀 Início Rápido

### Para novos desenvolvedores:
1. **Setup**: Consulte [MemoryBank - Setup Guide](../AI/MemoryBank/setup-onboarding-guide.md)
2. **Comandos**: Use [quick-reference.md](./quick-reference.md)
3. **Problemas**: Consulte [troubleshooting.md](./troubleshooting.md)

### Para desenvolvimento diário:
```bash
# Iniciar projeto
./start-project.sh

# Desenvolvimento backend
cd infrastructure/backend && npm run start:dev

# Desenvolvimento frontend
cd infrastructure/frontend && npm run dev
```

### Para deploy:
1. Siga o [deployment-checklist.md](./deployment-checklist.md)
2. Verifique [docker-guidelines.md](./docker-guidelines.md)

## 📖 MemoryBank vs Guidelines

| Aspecto | Guidelines | MemoryBank |
|---------|------------|------------|
| **Foco** | Comandos práticos | Contexto explicativo |
| **Conteúdo** | Como fazer | Por que fazer |
| **Uso** | Operacional | Educativo |
| **Público** | Desenvolvedores ativos | Novos devs, arquitetos |

### Exemplo:
- **Guidelines**: `npm run start:dev` - Comando para iniciar desenvolvimento
- **MemoryBank**: Explicação sobre hot reload, configuração do NestJS, benefícios

## 🔄 Manutenção

### Atualizar Guidelines:
- Quando houver novos comandos ou fluxos
- Após mudanças na infraestrutura
- Quando novos problemas forem identificados

### Atualizar MemoryBank:
- Quando houver mudanças arquiteturais
- Após decisões técnicas importantes
- Quando novos padrões forem estabelecidos

## 📞 Suporte

- **Problemas técnicos**: [troubleshooting.md](./troubleshooting.md)
- **Contexto do projeto**: [MemoryBank](../AI/MemoryBank/)
- **Issues**: GitHub Issues do projeto

## 📅 Última Atualização
27/01/2025
