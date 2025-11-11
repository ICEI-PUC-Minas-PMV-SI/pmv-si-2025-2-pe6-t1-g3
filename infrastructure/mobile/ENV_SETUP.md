# Configuração de Variáveis de Ambiente

## Criar arquivo .env

Crie um arquivo `.env` na raiz do projeto mobile (`infrastructure/mobile/.env`) com o seguinte conteúdo:

```env
# Configuração da API Backend
# IMPORTANTE: Substitua pelo IP da sua máquina na rede local
EXPO_PUBLIC_API_URL=http://SEU_IP_AQUI:3000

# API ViaCEP (não precisa alterar)
EXPO_PUBLIC_VIACEP_API_URL=https://viacep.com.br/ws

# Email de contato
EXPO_PUBLIC_CONTACT_EMAIL=contato@zabbixstore.com.br

# Google Client ID (opcional, para login com Google)
EXPO_PUBLIC_GOOGLE_CLIENT_ID=
```

## Como descobrir seu IP local

### Windows:
1. Abra o CMD (Prompt de Comando)
2. Digite: `ipconfig`
3. Procure por "IPv4 Address" na seção da sua conexão Wi-Fi/Ethernet
4. Exemplo: `192.168.1.100`

### Mac/Linux:
1. Abra o Terminal
2. Digite: `ifconfig` ou `ip addr show`
3. Procure por "inet" na seção da sua conexão Wi-Fi/Ethernet
4. Exemplo: `192.168.1.100`

## Exemplo de .env configurado:

```env
EXPO_PUBLIC_API_URL=http://192.168.1.100:3000
EXPO_PUBLIC_VIACEP_API_URL=https://viacep.com.br/ws
EXPO_PUBLIC_CONTACT_EMAIL=contato@zabbixstore.com.br
EXPO_PUBLIC_GOOGLE_CLIENT_ID=
```

## Notas Importantes:

1. **Mesma rede Wi-Fi:** Certifique-se de que seu dispositivo e computador estão na mesma rede Wi-Fi
2. **Backend rodando:** O backend deve estar rodando e acessível no IP configurado
3. **Firewall:** Certifique-se de que o firewall não está bloqueando as conexões
4. **Android Emulador:** Se estiver usando emulador Android, use `10.0.2.2` em vez do IP local

