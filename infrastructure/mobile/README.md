# ZabbixStore Mobile - React Native (Expo)

Aplicativo mobile do ZabbixStore desenvolvido com React Native e Expo Go.

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 18 ou superior)
- **npm** ou **yarn**
- **Expo CLI** (instalado globalmente)
- **Expo Go** instalado no seu dispositivo móvel:
  - [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
  - [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

## 🚀 Como Testar no Expo Go

### 1. Instalar Dependências

```bash
cd infrastructure/mobile
npm install
```

ou

```bash
yarn install
```

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto mobile (`infrastructure/mobile/.env`) com as seguintes variáveis:

```env
EXPO_PUBLIC_API_URL=http://seu-ip-local:3000
EXPO_PUBLIC_VIACEP_API_URL=https://viacep.com.br/ws
EXPO_PUBLIC_CONTACT_EMAIL=contato@zabbixstore.com.br
EXPO_PUBLIC_GOOGLE_CLIENT_ID=seu-google-client-id
```

**Importante:** 
- Substitua `seu-ip-local` pelo IP da sua máquina na rede local
- Para descobrir seu IP:
  - **Windows:** `ipconfig` (procure por IPv4)
  - **Mac/Linux:** `ifconfig` ou `ip addr show`
  - Exemplo: `http://192.168.1.100:3000`

### 3. Iniciar o Servidor de Desenvolvimento

```bash
npm start
```

ou

```bash
yarn start
```

Isso abrirá o **Expo DevTools** no navegador e mostrará um QR code no terminal.

### 4. Conectar no Expo Go

#### Opção A: Escanear QR Code (Recomendado)

1. Abra o app **Expo Go** no seu dispositivo
2. Toque em **"Scan QR code"**
3. Escaneie o QR code exibido no terminal ou no navegador

#### Opção B: Usar o Link Direto

1. No terminal, pressione:
   - `a` para abrir no Android
   - `i` para abrir no iOS (requer simulador)
   - `w` para abrir no navegador web

#### Opção C: Conectar Manualmente

1. No Expo Go, toque em **"Enter URL manually"**
2. Digite a URL exibida no terminal (ex: `exp://192.168.1.100:8081`)

### 5. Verificar Conexão

Após conectar, o app deve:
- Carregar a tela de login
- Conectar com o backend (se estiver rodando)
- Exibir as funcionalidades principais

## 🔧 Troubleshooting

### Problema: "Unable to connect to Metro bundler"

**Solução:**
1. Certifique-se de que o dispositivo e o computador estão na mesma rede Wi-Fi
2. Verifique se o firewall não está bloqueando a porta 8081
3. Tente reiniciar o servidor: `npm start -- --reset-cache`

### Problema: "Network request failed" ao chamar a API

**Solução:**
1. Verifique se o backend está rodando
2. Confirme que o IP no `.env` está correto
3. No Android, pode ser necessário usar `10.0.2.2` se estiver usando emulador
4. No iOS, use o IP local da sua máquina

### Problema: "Unable to resolve module"

**Solução:**
```bash
# Limpar cache e reinstalar
rm -rf node_modules
npm install
npm start -- --reset-cache
```

### Problema: Expo Go não encontra o servidor

**Solução:**
1. Certifique-se de que o Expo CLI está atualizado:
   ```bash
   npm install -g expo-cli@latest
   ```
2. Tente usar o modo tunnel:
   ```bash
   npm start -- --tunnel
   ```

### Problema: Erro de permissões no Android

**Solução:**
- Verifique as permissões no `app.json`
- Alguns recursos podem não estar disponíveis no Expo Go (use EAS Build para produção)

## 📱 Comandos Úteis

```bash
# Iniciar servidor
npm start

# Iniciar com cache limpo
npm start -- --reset-cache

# Iniciar em modo tunnel (útil se estiver em redes diferentes)
npm start -- --tunnel

# Executar testes
npm test

# Executar testes com cobertura
npm run test:coverage

# Verificar lint
npm run lint
```

## 🌐 Configuração de Rede

### Para Desenvolvimento Local

1. **Backend deve estar acessível na rede local:**
   - Certifique-se de que o backend está rodando e acessível via IP local
   - Exemplo: `http://192.168.1.100:3000`

2. **Firewall:**
   - Permita conexões na porta 8081 (Expo)
   - Permita conexões na porta do backend (3000)

### Para Teste em Dispositivos Diferentes

- **Mesma rede Wi-Fi:** Use o IP local
- **Redes diferentes:** Use o modo tunnel (`--tunnel`)
- **Emulador Android:** Use `10.0.2.2` em vez do IP local

## 📝 Notas Importantes

1. **Expo Go tem limitações:**
   - Alguns módulos nativos podem não estar disponíveis
   - Para recursos avançados, use EAS Build

2. **Hot Reload:**
   - O app atualiza automaticamente quando você salva arquivos
   - Pressione `r` no terminal para recarregar manualmente

3. **Debug:**
   - Agite o dispositivo para abrir o menu de desenvolvedor
   - Use React Native Debugger ou Chrome DevTools

## 🔗 Links Úteis

- [Documentação Expo](https://docs.expo.dev/)
- [Expo Go no App Store](https://apps.apple.com/app/expo-go/id982107779)
- [Expo Go no Google Play](https://play.google.com/store/apps/details?id=host.exp.exponent)
- [Troubleshooting Expo](https://docs.expo.dev/troubleshooting/clear-cache/)

## 📞 Suporte

Se encontrar problemas, verifique:
1. Logs no terminal do Expo
2. Logs no dispositivo (menu de desenvolvedor)
3. Documentação do Expo
4. Issues conhecidas no GitHub

