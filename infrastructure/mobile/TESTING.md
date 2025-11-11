# Guia de Testes - ZabbixStore Mobile

## 🧪 Testando no Expo Go - Passo a Passo

### Passo 1: Preparar o Ambiente

1. **Instalar Expo CLI globalmente** (se ainda não tiver):
   ```bash
   npm install -g expo-cli@latest
   ```

2. **Instalar dependências do projeto:**
   ```bash
   cd infrastructure/mobile
   npm install
   ```

### Passo 2: Configurar Variáveis de Ambiente

1. **Criar arquivo `.env`:**
   ```bash
   cp .env.example .env
   ```

2. **Editar o `.env` com suas configurações:**
   - Descobrir seu IP local:
     - Windows: Abra o CMD e digite `ipconfig`
     - Mac/Linux: Abra o Terminal e digite `ifconfig` ou `ip addr show`
   - Atualizar `EXPO_PUBLIC_API_URL` com seu IP:
     ```
     EXPO_PUBLIC_API_URL=http://SEU_IP_AQUI:3000
     ```
     Exemplo: `http://192.168.1.100:3000`

### Passo 3: Iniciar o Backend

Certifique-se de que o backend está rodando e acessível:

```bash
cd infrastructure/backend
npm start
```

O backend deve estar rodando em `http://localhost:3000` (ou a porta configurada).

### Passo 4: Iniciar o Expo

1. **No terminal, dentro da pasta `infrastructure/mobile`:**
   ```bash
   npm start
   ```

2. **Isso abrirá:**
   - Expo DevTools no navegador
   - QR Code no terminal
   - Menu interativo no terminal

### Passo 5: Conectar no Dispositivo

#### Android:

1. Abra o app **Expo Go** no seu dispositivo Android
2. Toque em **"Scan QR code"**
3. Escaneie o QR code exibido no terminal
4. Aguarde o app carregar

#### iOS:

1. Abra o app **Expo Go** no seu iPhone/iPad
2. Use a câmera do iOS para escanear o QR code
3. Toque na notificação que aparecer
4. Aguarde o app carregar

### Passo 6: Verificar Funcionalidades

Teste as seguintes funcionalidades:

#### ✅ Autenticação
- [ ] Tela de Login carrega corretamente
- [ ] Login funciona com credenciais válidas
- [ ] Registro de novo usuário funciona
- [ ] Logout funciona

#### ✅ Navegação
- [ ] Bottom tabs aparecem após login
- [ ] Navegação entre telas funciona
- [ ] Botão voltar funciona corretamente

#### ✅ Produtos
- [ ] Dashboard mostra produtos
- [ ] Lista de produtos carrega
- [ ] Detalhes do produto abrem
- [ ] Busca de produtos funciona
- [ ] Filtros funcionam

#### ✅ Carrinho
- [ ] Adicionar produto ao carrinho funciona
- [ ] Carrinho mostra produtos corretos
- [ ] Alterar quantidade funciona
- [ ] Remover produto funciona
- [ ] Finalizar pedido funciona

#### ✅ Conta
- [ ] Perfil carrega dados do usuário
- [ ] Editar perfil funciona
- [ ] Alterar senha funciona
- [ ] Endereços aparecem corretamente
- [ ] Adicionar/editar endereço funciona
- [ ] Histórico de pedidos carrega
- [ ] Favoritos funcionam

## 🔍 Debugging

### Ver Logs

1. **No terminal do Expo:**
   - Pressione `j` para abrir o debugger
   - Pressione `r` para recarregar
   - Pressione `m` para abrir o menu

2. **No dispositivo:**
   - Agite o dispositivo para abrir o menu de desenvolvedor
   - Toque em "Debug Remote JS" para usar Chrome DevTools

### Problemas Comuns

#### ❌ "Unable to connect to Metro bundler"

**Solução:**
```bash
# Limpar cache e reiniciar
npm start -- --reset-cache
```

#### ❌ "Network request failed"

**Solução:**
1. Verifique se o backend está rodando
2. Confirme o IP no `.env`
3. Verifique se dispositivo e PC estão na mesma rede
4. No Android emulador, use `10.0.2.2` em vez do IP local

#### ❌ "Unable to resolve module"

**Solução:**
```bash
# Reinstalar dependências
rm -rf node_modules
npm install
npm start -- --reset-cache
```

#### ❌ Expo Go não encontra o servidor

**Solução:**
```bash
# Usar modo tunnel
npm start -- --tunnel
```

## 📊 Checklist de Testes

### Funcionalidades Básicas
- [ ] App inicia sem erros
- [ ] Tela de login aparece
- [ ] Navegação funciona
- [ ] API conecta corretamente

### Funcionalidades de Produto
- [ ] Lista de produtos carrega
- [ ] Busca funciona
- [ ] Detalhes do produto abrem
- [ ] Adicionar ao carrinho funciona
- [ ] Favoritos funcionam

### Funcionalidades de Usuário
- [ ] Login funciona
- [ ] Registro funciona
- [ ] Perfil carrega
- [ ] Editar perfil funciona
- [ ] Endereços funcionam
- [ ] Histórico carrega

### Funcionalidades de Pedido
- [ ] Carrinho funciona
- [ ] Finalizar pedido funciona
- [ ] Histórico mostra pedidos

## 🚀 Próximos Passos

Após testar no Expo Go:

1. **Corrigir bugs encontrados**
2. **Otimizar performance**
3. **Adicionar testes automatizados**
4. **Preparar para build de produção (EAS Build)**

## 📝 Notas

- O Expo Go tem algumas limitações (alguns módulos nativos podem não estar disponíveis)
- Para recursos avançados, considere usar EAS Build
- Sempre teste em dispositivos reais, não apenas emuladores
- Teste em diferentes tamanhos de tela (Android e iOS)

