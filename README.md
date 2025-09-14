<h1 align="center">ZABBIX STORE</h1> 
<div align="center">
  <img width="498" height="383" alt="Image" src="https://github.com/user-attachments/assets/e8981c7b-7308-47b5-bf49-70a4dd7ab00a" />
</div>


`CURSO: Sistemas de Informação`

`DISCIPLINA: Projeto - Arquitetura de Sistemas Distribuídos`

`SEMESTRE: 6º`

A ZABBIX STORE é uma plataforma de e-commerce web e mobile, com arquitetura de sistemas distribuídos para garantir escalabilidade e alta disponibilidade. Voltada para lojistas de pequeno e médio porte, oferece gestão integrada de produtos e pedidos, proporcionando uma experiência de compra segura e prática para consumidores.

## Integrantes

* Ítalo Fideles Vieira do Nascimento
* Jully Anne Roman Palhano Dutra
* Lucas Morais Barcelos
* Pedro Henrique Nunes Alves
* Victor Hugo Vasquez da Silva
* Vinícius Pereira Coelho

## Orientador

* Kleber Jacques Ferreira de Souza

# Planejamento

| Etapa         | Atividades |
|  :----:   | ----------- |
| ETAPA 1         |[Documentação de Contexto](docs/contexto.md) <br> |
| ETAPA 2         |[Planejar, desenvolver e gerenciar APIs e Web Services](docs/backend-apis.md) <br> |
| ETAPA 3         |[Planejar, desenvolver e gerenciar uma aplicação Web](docs/frontend-web.md) |
| ETAPA 4        |[Planejar, desenvolver e gerenciar uma aplicação Móvel](docs/frontend-mobile.md) <br>  |
| ETAPA 5         | [Apresentação](presentation/README.md) |
## Como rodar o projeto

### Modo Docker (Produção)

1. Copie o arquivo de configuração de exemplo:
   ```bash
   cp .env.example .env
   ```

2. Execute o script de inicialização:
   ```bash
   ./start-project.sh
   ```

O script irá configurar e inicializar todos os serviços automaticamente.

### Modo Desenvolvimento/Debug

1. **Frontend:**
   ```bash
   cd infrastructure/frontend
   cp .env.example .env
   # Editar .env conforme necessário
   npm install
   npm run dev
   ```

2. **Banco de dados:**
   ```bash
   cd infrastructure/backend
   cp .env.example .env
   # Editar .env conforme necessário
   docker-compose up -d postgres
   ```

3. **Backend:**
   ```bash
   cd infrastructure/backend
   cp .env.example .env
   # Editar .env conforme necessário
   npm install
   npx prisma generate
   npx prisma migrate dev
   # Escreva qualquer nome para o nome da nova migração
   npm run start:dev
   ```

Os serviços estarão disponíveis em:
- Frontend: http://localhost:5173
- Backend: http://localhost:3000
- PostgreSQL: localhost:9080

# Código

<li><a href="src/README.md"> Código Fonte</a></li>

# Apresentação

<li><a href="presentation/README.md"> Apresentação da solução</a></li>
