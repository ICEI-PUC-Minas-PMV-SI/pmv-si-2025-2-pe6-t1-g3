# ZabbixStore API Collection - Postman

Esta collection do Postman contém todas as rotas da API da ZabbixStore documentadas no arquivo `backend-apis.md`, organizadas por módulos funcionais e incluindo casos de teste automatizados.

## 📁 Arquivos Incluídos

- `ZabbixStore-API-Collection.postman_collection.json` - Collection principal com todas as rotas e casos de teste
- `ZabbixStore-Environment.postman_environment.json` - Ambiente com variáveis configuradas para local e produção
- `POSTMAN_COLLECTION_README.md` - Este arquivo com instruções

## 🚀 Como Usar

### 1. Importar no Postman

1. Abra o Postman
2. Clique em **Import**
3. Selecione os arquivos:
   - `ZabbixStore-API-Collection.postman_collection.json`
   - `ZabbixStore-Environment.postman_environment.json`

### 2. Configurar Ambiente

1. No Postman, selecione o ambiente **"ZabbixStore Environment"**
2. Para ambiente **local**: `base_url` = `http://localhost:3000`
3. Para ambiente **produção**: Altere `base_url` para `https://zabbix.pnunes-develop.work`
4. **IMPORTANTE**: Execute primeiro os logins para gerar tokens automaticamente

### 3. Executar Testes

#### Sequência Recomendada para Testes:

1. **Login Admin (Gerar Token)** - Gerar token de administrador automaticamente
2. **Login Cliente (Gerar Token)** - Gerar token de cliente automaticamente
3. **Health Check** - Verificar se a API está funcionando
4. **Casos de Teste** - Executar testes automatizados por categoria
5. **Endpoints Funcionais** - Testar rotas específicas conforme necessário

#### Para Casos de Teste Automatizados:
1. **🔐 Testes de Autenticação** - Casos 1-6
2. **🛡️ Testes de Autorização** - Casos 9-11
3. **📦 Testes de Produtos** - Casos 12-17
4. **🛒 Testes de Pedidos** - Casos 21-25
5. **👤 Testes de Pessoas** - Casos 25-26
6. **📍 Testes de Endereços** - Casos 27-29
7. **🏥 Testes de Health Check** - Casos 30-31

## 📋 Estrutura da Collection

### 🔐 Autenticação
- **Login Admin (Gerar Token)** - Gera token de admin automaticamente
- **Login Cliente (Gerar Token)** - Gera token de cliente automaticamente
- **Login** - Autentica usuário e retorna JWT
- **Registro** - Cria novo usuário
- **Alterar Senha** - Muda senha do usuário autenticado
- **Validar Token** - Verifica se token JWT é válido

### 📦 Produtos
- **Listar Produtos** - Lista todos os produtos (público)
- **Listar por Categoria** - Filtra produtos por categoria
- **Buscar por ID** - Busca produto específico (público)
- **Cadastrar** - Cria produto (Admin apenas)
- **Atualizar** - Atualiza produto (Admin apenas)
- **Remover** - Remove produto (Admin apenas)

### 📍 Endereços
- **Cadastrar** - Adiciona novo endereço
- **Atualizar** - Modifica endereço existente
- **Deletar** - Remove endereço

### 🛒 Pedidos
- **Cadastrar** - Cria novo pedido
- **Listar** - Lista pedidos do usuário
- **Listar por Status** - Filtra pedidos por status
- **Atualizar** - Muda status do pedido
- **Deletar** - Remove pedido
- **Buscar** - Busca pedido específico

### 👤 Pessoas
- **Buscar** - Obtém dados do usuário
- **Atualizar** - Modifica dados do usuário

### 🏥 Health Check
- **Health Check** - Status da API
- **Endpoint Raiz** - Informações básicas

### 🧪 Testes de Cenários
- **Login com Credenciais Inválidas** - Testa erro 401
- **Acesso sem Token** - Testa erro 401
- **Acesso Admin com Usuário Comum** - Testa erro 403
- **Buscar Produto Inexistente** - Testa erro 404
- **Criar Pedido sem Estoque** - Testa erro 400

### 🧪 Casos de Teste - Backend APIs
- **🔐 Testes de Autenticação** - 6 casos de teste automatizados
- **🛡️ Testes de Autorização** - 3 casos de teste automatizados
- **📦 Testes de Produtos** - 6 casos de teste automatizados
- **🛒 Testes de Pedidos** - 5 casos de teste automatizados
- **👤 Testes de Pessoas/Usuários** - 2 casos de teste automatizados
- **📍 Testes de Endereços** - 3 casos de teste automatizados
- **🏥 Testes de Health Check** - 2 casos de teste automatizados

## 🔧 Variáveis de Ambiente

| Variável | Descrição | Valor Padrão |
|----------|-----------|--------------|
| `base_url_local` | URL local da API | `http://localhost:3000` |
| `base_url_prod` | URL de produção da API | `https://zabbix.pnunes-develop.work` |
| `base_url` | URL base atual (referência dinâmica) | `{{base_url_local}}` |
| `token_admin` | Token JWT do administrador (gerado automaticamente) | (vazio) |
| `token_client` | Token JWT do cliente (gerado automaticamente) | (vazio) |
| `auth_token` | Token JWT do usuário comum (referência) | `{{token_client}}` |
| `admin_token` | Token JWT do administrador (referência) | `{{token_admin}}` |
| `admin_email` | Email do usuário admin | `admin@store.com` |
| `admin_password` | Senha do usuário admin | `Admin123` |
| `client_email` | Email do usuário cliente | `cliente@teste.com` |
| `client_password` | Senha do usuário cliente | `Cliente123` |
| `user_id` | ID do usuário para testes | `1` |
| `product_id` | ID do produto para testes | `1` |
| `order_id` | ID do pedido para testes | `1` |
| `address_id` | ID do endereço para testes | `1` |

## 🔑 Autenticação

### ⚡ Geração Automática de Tokens (RECOMENDADO):

#### Para Usuário Admin:
1. Execute **"Login Admin (Gerar Token)"**
2. O token será salvo automaticamente na variável `token_admin`
3. Todas as requisições que precisam de token admin usarão automaticamente

#### Para Usuário Cliente:
1. Execute **"Login Cliente (Gerar Token)"**
2. O token será salvo automaticamente na variável `token_client`
3. Todas as requisições que precisam de token cliente usarão automaticamente

### 🔧 Geração Manual (Alternativa):

#### Para Usuário Comum:
1. Execute **Registro** ou **Login**
2. Copie o token da resposta
3. Cole na variável `auth_token` do ambiente

#### Para Administrador:
1. Faça login com usuário admin
2. Copie o token da resposta
3. Cole na variável `admin_token` do ambiente

## 📝 Exemplos de Payloads

### Login Admin
```json
{
  "EMAIL": "admin@store.com",
  "SENHA": "Admin123"
}
```

### Login Cliente
```json
{
  "EMAIL": "cliente@teste.com",
  "SENHA": "Cliente123"
}
```

### Registro
```json
{
  "EMAIL": "usuario@exemplo.com",
  "SENHA": "Senha@123",
  "NOME": "João",
  "SOBRENOME": "Silva",
  "CPF": "12345678900",
  "TELEFONE": "11987654321",
  "ENDERECO": {
    "DESCRICAO": "Casa",
    "CEP": "12345678",
    "RUA": "Rua das Flores",
    "NUMERO": "123",
    "COMPLEMENTO": "Apto 42",
    "BAIRRO": "Centro",
    "CIDADE": "São Paulo"
  }
}
```

### Cadastrar Produto (Admin)
```json
{
  "PRODUTO": "Camiseta Polo",
  "DESCRICAO": "Camiseta polo masculina 100% algodão",
  "VALOR": 29.99,
  "ESTOQUE": 50,
  "CODCAT": 1,
  "IMAGEM": "https://exemplo.com/imagem.jpg",
  "DESCONTO": 0
}
```

### Criar Pedido
```json
{
  "CODPES": 1,
  "CODEND": 1,
  "ITENS": [
    {
      "CODPROD": 1,
      "QUANTIDADE": 2
    }
  ]
}
```

## 🧪 Executando Testes Automatizados

### Runner do Postman:
1. Clique em **Runner** no Postman
2. Selecione a collection **ZabbixStore API Collection**
3. Selecione o ambiente **ZabbixStore Environment**
4. Configure a ordem de execução
5. Clique em **Run**

### Ordem Recomendada:
1. **Login Admin (Gerar Token)** - Gerar token de admin
2. **Login Cliente (Gerar Token)** - Gerar token de cliente
3. **Health Check** - Verificar API
4. **Casos de Teste** - Executar testes automatizados
5. **Endpoints Funcionais** - Testar rotas específicas

### Para Execução de Casos de Teste:
1. **🔐 Testes de Autenticação** (Casos 1-6)
2. **🛡️ Testes de Autorização** (Casos 9-11)
3. **📦 Testes de Produtos** (Casos 12-17)
4. **🛒 Testes de Pedidos** (Casos 21-25)
5. **👤 Testes de Pessoas** (Casos 25-26)
6. **📍 Testes de Endereços** (Casos 27-29)
7. **🏥 Testes de Health Check** (Casos 30-31)

## ⚠️ Observações Importantes

1. **Backend deve estar rodando** em `http://localhost:3000` (local) ou `https://zabbix.pnunes-develop.work` (produção)
2. **Banco de dados** deve estar configurado e populado
3. **Tokens JWT** expiram em 24 horas
4. **Endpoints Admin** requerem token de administrador
5. **Endpoints protegidos** requerem token válido
6. **Geração automática de tokens** funciona apenas com usuários pré-cadastrados
7. **Credenciais padrão**:
   - Admin: `admin@store.com` / `Admin123`
   - Cliente: `cliente@teste.com` / `Cliente123`

## 🔍 Troubleshooting

### Erro 401 (Unauthorized):
- Verifique se o token está correto
- Confirme se o token não expirou
- Teste fazer login novamente

### Erro 403 (Forbidden):
- Verifique se está usando token de admin para endpoints administrativos
- Confirme se o usuário tem permissões adequadas

### Erro 404 (Not Found):
- Verifique se o ID do recurso existe
- Confirme se a rota está correta

### Erro 500 (Internal Server Error):
- Verifique se o backend está rodando
- Confirme se o banco de dados está acessível
- Verifique os logs do servidor

## 📊 Status Codes Esperados

| Endpoint | Método | Status Esperado |
|----------|--------|-----------------|
| `/health` | GET | 200 |
| `/auth/login` | POST | 200 (sucesso) / 401 (erro) |
| `/auth/registro` | POST | 201 (sucesso) / 400 (erro) |
| `/produto/listar` | GET | 200 |
| `/produto/cadastrar` | POST | 201 (admin) / 403 (usuário comum) |
| `/pedido/cadastrar` | POST | 201 (sucesso) / 400 (erro) |

## 🎯 Próximos Passos

1. **Execute os logins** para gerar tokens automaticamente
2. **Execute todos os casos de teste** da seção "🧪 Casos de Teste - Backend APIs"
3. **Documente os resultados** encontrados
4. **Reporte bugs** ou comportamentos inesperados
5. **Sugira melhorias** na API

## 🆕 Novidades da Collection

### ✨ Funcionalidades Adicionadas:
- **Geração automática de tokens** via scripts post-request
- **Casos de teste automatizados** baseados no backend-apis.md
- **Suporte a ambientes** local e produção
- **Variáveis dinâmicas** que se atualizam automaticamente
- **Organização por categorias** de teste
- **Credenciais pré-configuradas** para admin e cliente

### 🔄 Como Usar as Novas Funcionalidades:
1. **Importe** a collection e environment atualizados
2. **Execute** "Login Admin (Gerar Token)" e "Login Cliente (Gerar Token)"
3. **Use** os casos de teste organizados por categoria
4. **Alterne** entre ambientes local e produção conforme necessário

---

**Desenvolvido para o projeto ZabbixStore - PMV SI 2025-2**

