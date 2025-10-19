# Front-end Web

O **Zabbix Store** tem como objetivo oferecer uma **plataforma de e-commerce**, onde vendedores possam disponibilizar seus produtos e clientes possam pesquisar, comparar e realizar compras de maneira simples e rápida.  

- **Facilitar a jornada do usuário**: desde a busca por produtos até o checkout.  
- **Garantir usabilidade** em diferentes dispositivos (desktop, tablet, mobile).  
- **Fornecer segurança** em todo o fluxo de navegação e compra.
- **Disponibilizar análise de vendas para fornecedores**, auxiliando no acompanhamento de desempenho e estratégias comerciais. 

## Projeto da Interface Web

A interface web da Zabbix Store será desenvolvida com foco em usabilidade, consistência visual e experiência de compra fluida, garantindo que clientes e fornecedores realizem suas tarefas de forma intuitiva e segura.


### Design Visual
- Layout moderno e clean, priorizando **clareza e hierarquia visual**.  
- Paleta de cores neutras com acentos para **destaques, estados e categorias**, transmitindo profissionalismo e confiança.  
- Tipografia moderna: **Poppins** para títulos e elementos de destaque, **Montserrat** e **Inter** para textos complementares e descrições.  
- Ícones padronizados (React Icons / Feather Icons) e componentes consistentes para facilitar a navegação.  
- Sombras suaves, bordas arredondadas e transições de hover para melhorar percepção de interatividade.


### Layout das Páginas
- **Página Inicial (Home):** banners promocionais, produtos em destaque, categorias e atalhos para seções principais.  
- **Página de Categoria / Catálogo:** listagem de produtos com filtros por preço, avaliação, categorias e ordenação dinâmica.  
- **Página de Produto:** informações detalhadas, imagens em cards, preço, avaliações, descrições e botão de ação “Adicionar ao Carrinho”.  
- **Carrinho e Checkout:** exibição organizada dos produtos selecionados, possibilidade de alterar quantidades ou remover itens, e finalização da compra de forma simples e intuitiva.
- **Painel do Usuário (Cliente):** histórico de pedidos, favoritos e configurações de perfil.  
- **Painel do Fornecedor:** cadastro e gerenciamento de produtos, controle de estoque e relatórios de vendas.


### Interações do Usuário
- Barra de navegação intuitiva, breadcrumbs e menus claros para fácil localização.  
- Pesquisa dinâmica com **autocompletar**.  
- Filtros e ordenações **dinâmicos**, atualizando produtos sem recarregar a página.  
- Feedbacks visuais: notificações, loaders, mensagens de sucesso e alerta.  
- Carrinho persistente, mantendo produtos adicionados mesmo após logout.


### Outros Aspectos Relevantes
- **Design responsivo**, compatível com desktop, tablet e mobile.  
- Integração com APIs do backend para exibição de dados e atualização de estoque em tempo real.  
- **Segurança** no tratamento de informações do usuário e autenticação.  
- Elementos de UI/UX que promovem **fluidez na jornada de compra**, desde a busca até o checkout.


### Wireframes

<details>
  <summary><strong>🏠 Home</strong></summary>

  <p><code>Versão Web_Desktop e Web_Mobile</code></p>

  <img src="../docs/img/wireframes/Desktop_home.png" width="600" alt="Versão Desktop">
  <img src="../docs/img/wireframes/Mobile_home.png" width="100" alt="Versão Mobile">

A tela inicial foi desenvolvida como o ponto de entrada principal da plataforma, oferecendo uma navegação moderna, intuitiva e organizada. Seu objetivo é destacar os principais produtos e categorias, facilitando o acesso rápido às áreas de interesse do usuário.

O layout é responsivo e funcional, adaptando-se perfeitamente a diferentes dispositivos. O menu fixo superior reúne as opções Início, Categorias, Cadastro, Carrinho e Perfil, garantindo fácil navegação.

Logo abaixo, um banner principal destaca produtos em evidência, seguido por seções organizadas por categoria, como Eletrônicos, Fashion e Esporte, apresentadas em cards visuais com imagem, nome, preço e botão de compra.

A página conta ainda com uma barra de busca centralizada, que agiliza a localização de produtos. O design adota cores sóbrias combinadas a tons de destaque para realçar elementos interativos, transmitindo profissionalismo e confiança.

Por fim, o rodapé reúne links institucionais, contatos e políticas da loja, reforçando a credibilidade e completando uma estrutura pensada para usabilidade e conversão.  

</details>

<details>
  <summary><strong>👤 Acesso do Usuário</strong></summary>

As telas protegidas da Zabbix Store foram desenvolvidas para garantir a segurança e privacidade dos usuários, permitindo o acesso apenas mediante autenticação. Essas páginas fazem parte do fluxo de controle de acesso da plataforma, assegurando que cada usuário possa gerenciar suas informações e atividades de forma segura e personalizada.

  <details>
    <summary><strong>📝 Cadastro</strong></summary>
    <p><code>Versão Web_Desktop e Web_Mobile</code></p>
    <img src="../docs/img/wireframes/Desktop_register.png" width="500" alt="Versão Desktop">
    <img src="../docs/img/wireframes/Mobile_register.png" width="200" alt="Versão Mobile">

Na página de cadastro, o usuário pode criar uma nova conta informando dados básicos, como nome, e-mail e senha. O processo é direto e validado em tempo real, garantindo a integridade das informações inseridas.

  </details>

  <details>
    <summary><strong>🔑 Login</strong></summary>
    <p><code>Versão Web_Desktop e Web_Mobile</code></p>
    <img src="../docs/img/wireframes/Desktop_login.png" width="500" alt="Versão Desktop">
    <img src="../docs/img/wireframes/Mobile_login.png" width="200" alt="Versão Mobile">

A página de login oferece uma interface simples e intuitiva, com campos para e-mail e senha. O design segue o padrão visual da plataforma, mantendo a coerência com o restante do site.
    
  </details>

  <details>
    <summary><strong>⚙️ Gerenciamento de conta</strong></summary>
    <p><code>Versão Web_Desktop e Web_Mobile</code></p>
    <img src="../docs/img/wireframes/Desktop_account.png" width="600" alt="Versão Desktop">
    <img src="../docs/img/wireframes/Mobile_account.png" width="100" alt="Versão Mobile">

    Já o gerenciamento de conta permite que o usuário visualize e edite seus dados pessoais e gerencie endereços. Essa área é acessível apenas após o login, garantindo a proteção dos dados armazenados.

  </details>

</details>

<details>
  <summary><strong>🛍️ Compras</strong></summary>

  <details>
    <summary><strong>📦 Produtos</strong></summary>
    <p><code>Versão Web_Desktop e Web_Mobile</code></p>
    <img src="../docs/img/wireframes/Desktop_product.png" width="600" alt="Versão Desktop">
    <img src="../docs/img/wireframes/Mobile_product.png" width="200" alt="Versão Mobile">

Os produtos são apresentados em uma listagem de itens disponíveis na plataforma, organizada por categorias e filtros de busca. Cada produto é exibido em um card visual, contendo imagem, nome, preço e botão de compra.
O usuário pode visualizar detalhes completos do item ao clicar no card, incluindo descrição, avaliações, estoque e informações técnicas.

  </details>

  <details>
    <summary><strong>❤️ Favoritos</strong></summary>
    <p><code>Versão Web_Desktop e Web_Mobile</code></p>
    <img src="../docs/img/wireframes/Desktop_favorites.svg" width="600" alt="Versão Desktop">
    <img src="../docs/img/wireframes/Mobile_favorites.svg" width="200" alt="Versão Mobile">

A página de favoritos permite que o usuário salve produtos de interesse para consultar ou comprar mais tarde.
Os itens marcados como favoritos aparecem organizados em uma lista visual semelhante à da página de produtos, exibindo imagem, nome, preço e atalhos para “Ver Detalhes” ou “Adicionar ao Carrinho”.

  </details>

  <details>
    <summary><strong>🛒 Carrinho</strong></summary>
    <p><code>Versão Web_Desktop e Web_Mobile</code></p>
    <img src="../docs/img/wireframes/Desktop_cart.png" width="700" alt="Versão Desktop">
    <img src="../docs/img/wireframes/Mobile_cart.png" width="200" alt="Versão Mobile">

A página de carrinho reúne todos os produtos selecionados para compra. Cada item é apresentado com imagem, nome, preço unitário, quantidade e valor total.
O usuário pode alterar quantidades, remover itens ou seguir para o checkout, visualizando em tempo real o subtotal da compra.

  </details>

</details>

<details>
  <summary><strong>📊 Dashbord fornecedor</strong></summary>

O Dashboard contém  áreas restritas aos usuários fornecedores, permitindo o acompanhamento e controle das atividades comerciais dentro da plataforma.

  <details>
    <summary><strong>📈 Análise de Vendas</strong></summary>
    <p><code>Versão Web_Desktop e Web_Mobile</code></p>
    <img src="../docs/img/wireframes/Desktop_admin.png" width="600" alt="Versão Desktop">
    <img src="../docs/img/wireframes/Mobile_admin.png" width="200" alt="Versão Mobile">

Na seção de Análise de Vendas, o fornecedor tem acesso a relatórios detalhados sobre pedidos, lucros, produtos mais vendidos e períodos de maior movimentação. As informações podem ser filtradas por data e categoria, auxiliando na tomada de decisões estratégicas.

  </details>

  <details>
    <summary><strong>📦 Gerenciamento e cadastro de produtos </strong></summary>
    <p><code>Versão Web_Desktop e Web_Mobile</code></p>
    <img src="../docs/img/wireframes/Desktop_admi2.png" width="600" alt="Versão Desktop">
    <img src="../docs/img/wireframes/Mobile_admi2.png" width="200" alt="Versão Mobile">

O Gerenciamento e cadastro de Produtos permite ao fornecedor inserir, editar ou remover itens da loja. É possível definir nome, descrição, categoria, preço, imagens e quantidade em estoque. Essa funcionalidade oferece controle total sobre o catálogo de produtos, garantindo que as informações exibidas aos clientes estejam sempre atualizadas.

  </details>

</details>

<details>
  <summary><strong>ℹ️ Sobre</strong></summary>

  <p><code>Versão Web_Desktop e Web_Mobile</code></p>

  <img src="../docs/img/wireframes/Desktop_about.png" width="600" alt="Versão Desktop">
  <img src="../docs/img/wireframes/Mobile_about.png" width="200" alt="Versão Mobile">

A página Sobre tem como objetivo apresentar a Zabbix Store, destacando sua proposta, valores e funcionalidades principais.
  
</details>

### Design Visual

#### Tipografia

O projeto adota uma combinação de fontes que equilibra modernidade, legibilidade e consistência visual em toda a interface. As famílias tipográficas foram selecionadas para oferecer contraste harmônico entre títulos, textos e elementos complementares.

**Poppins**
- Utilizada em títulos, cabeçalhos e elementos de destaque da interface.
- Transmite modernidade e clareza visual, reforçando a identidade do produto.

**Montserrat**
- Aplicada em textos secundários, descrições e blocos de conteúdo mais extensos.
- Oferece excelente leitura em tamanhos menores e complementa visualmente a Poppins.

**Inter**
- Definida como fonte de fallback, garantindo compatibilidade e legibilidade em sistemas que não suportem as fontes principais.

<img src="../docs/img/tipografia.png" alt="Exemplo de tipografia - versão mobile">

#### Paleta de Cores

A paleta de cores do ZabbixStore foi desenvolvida com base em um design minimalista e profissional, utilizando tons neutros com acentos em preto para criar contraste e hierarquia visual:

<img src="../docs/img/paleta_cores.png" alt="Versão Mobile">

#### Elementos Gráficos

**Ícones:**

A iconografia abaixo foi desenvolvida para garantir uma comunicação visual clara e padronizada em todas as telas do sistema. Cada ícone possui um significado específico, facilitando a navegação e a compreensão das ações disponíveis para o usuário.

- Utilização de React Icons (Feather Icons) para consistência visual
- Ícones principais: FiShoppingBag, FiStar, FiTrendingUp, FiArrowRight
- Tamanho padrão: 24px (w-6 h-6) para ícones de interface

<img src="../docs/img/iconografia.png" alt="Versão Mobile">

| Nº  | Significado               | Descrição                                                                 |
|-----|---------------------------|---------------------------------------------------------------------------|
| 1   | Menu                      | Abre o menu lateral de navegação.                                         |
| 2   | Perfil                    | Exibe as informações do usuário.                                          |
| 3   | Logout                    | Encerra a sessão.                                                         |
| 4   | Sacola de pedidos         | Permite visualizar os pedidos realizados ou em andamento.                 |
| 5   | Produto / Item            | Representa produtos, pacotes ou estoque.                                  |
| 6   | Carrinho                  | Adiciona ou visualiza itens no carrinho de compras.                       |
| 7   | Remover dos favoritos     | Retira um item da lista de favoritos.                                     |
| 8   | Favoritar                 | Adiciona um item aos favoritos.                                           |
| 9   | Receita                   | Indica valores do painel de controle da área financeira.                  |
| 10  | Painel administrativo     | Permite gerenciar produtos, pedidos e visualizar métricas.                |
| 11  | Editar                    | Permite alterar ou modificar um item.                                     |
| 12  | Excluir                   | Remove permanentemente um item.                                           |
| 13  | Localização               | Exibe o endereço e o endereço de entrega.                                 |
| 14  | Pedidos / Lista           | Mostra pedidos, tarefas ou histórico.                                     |
| 15  | Atualizar / Sincronizar   | Atualiza os dados ou sincroniza informações.                              | 

**Sombras e Efeitos:**
- Sombras suaves com rgba(0, 0, 0, 0.1) para cards de produtos
- Sombras mais pronunciadas (rgba(0, 0, 0, 0.2)) para formulários
- Transições suaves de 0.3s para todos os elementos interativos
- Efeitos de hover com mudança de escala (scale-105) e sombra

**Bordas e Cantos:**
- Border-radius padrão de 5px para botões e inputs
- Border-radius de 9px para formulários principais
- Bordas sólidas pretas (#000000) para inputs e elementos de foco

Esta decisões foram definidas para transmitir confiança, profissionalismo e modernidade, características essenciais para uma plataforma de e-commerce, mantendo a legibilidade e acessibilidade em todos os elementos da interface.


## Fluxo de Dados

## Fluxo de Dados da Aplicação

O fluxo de dados da ZabbixStore é baseado em uma arquitetura cliente-servidor, onde o frontend React consome APIs REST do backend NestJS, que por sua vez interage com o banco de dados PostgreSQL através do Prisma ORM.

### Arquitetura Geral

```
Frontend (React) ↔ Backend (NestJS) ↔ Banco de Dados (PostgreSQL)
     ↓                    ↓                    ↓
- Contextos React    - Controllers         - Prisma ORM
- Hooks customizados - Services           - Schema definido
- Componentes        - DTOs/Validação     - Migrations
- LocalStorage       - JWT Auth           - Relacionamentos
```

<details>
<summary><strong>🔐 1. Fluxo de Autenticação</strong></summary>

#### 1.1 Cadastro de Usuário
**Entrada:** Nome, email, senha, confirmação de senha
**Processamento:**
- Validação de campos obrigatórios no frontend
- Envio via POST `/auth/registro` para o backend
- Validação de email único no banco de dados
- Hash da senha com bcrypt (salt rounds: 12)
- Criação do registro na tabela `pessoa`

**Saída:** Dados do usuário criado (sem senha)
**Persistência:** Dados salvos no PostgreSQL via Prisma

#### 1.2 Login
**Entrada:** Email e senha
**Processamento:**
- Validação de credenciais via POST `/auth/login`
- Verificação de hash da senha no banco
- Geração de token JWT com expiração de 24 horas
- Armazenamento do token no localStorage

**Saída:** Token JWT e dados do usuário
**Persistência:** Token no localStorage, sessão ativa no contexto React

#### 1.3 Validação de Token
**Processamento:**
- Verificação automática do token em cada requisição
- Decodificação do JWT para extrair dados do usuário
- Validação de expiração (24 horas)
- Redirecionamento para login se token inválido

</details>

<details>
<summary><strong>🛍️ 2. Fluxo de Produtos</strong></summary>

#### 2.1 Listagem de Produtos (Home/Dashboard)
**Entrada:** Requisição GET `/produto/listar`
**Processamento:**
- Busca todos os produtos ativos no banco
- Aplicação de filtros opcionais (categoria)
- Ordenação por relevância/preço
- Paginação de resultados

**Saída:** Array de produtos com dados básicos
**Persistência:** Cache no contexto React, dados do PostgreSQL

#### 2.2 Busca de Produtos
**Entrada:** Termo de busca via GET `/produto/buscar`
**Processamento:**
- Busca por nome, descrição ou categoria
- Filtros dinâmicos (preço, avaliação, disponibilidade)
- Ordenação por relevância, preço, popularidade

**Saída:** Lista filtrada de produtos
**Persistência:** Resultados temporários no estado do componente

#### 2.3 Detalhes do Produto
**Entrada:** ID do produto via GET `/produto/buscar?CODPROD={id}`
**Processamento:**
- Busca produto específico no banco
- Carregamento de informações detalhadas
- Verificação de estoque disponível
- Carregamento de avaliações relacionadas

**Saída:** Dados completos do produto
**Persistência:** Dados do PostgreSQL, cache no contexto

#### 2.4 Cadastro/Edição de Produtos (Admin)
**Entrada:** Dados do produto via POST/PUT `/produto/cadastrar` ou `/produto/atualizar`
**Processamento:**
- Validação de dados obrigatórios
- Verificação de permissões (role ADMIN)
- Upload de imagens (se aplicável)
- Cálculo automático de campos derivados

**Saída:** Produto criado/atualizado
**Persistência:** Dados salvos no PostgreSQL via Prisma

</details>

<details>
<summary><strong>🛒 3. Fluxo de Carrinho de Compras</strong></summary>

#### 3.1 Adicionar ao Carrinho
**Entrada:** ID do produto e quantidade
**Processamento:**
- Verificação de estoque disponível
- Validação de dados do produto
- Atualização do contexto do carrinho
- Persistência no localStorage

**Saída:** Item adicionado ao carrinho
**Persistência:** localStorage + contexto React

#### 3.2 Gerenciamento do Carrinho
**Processamento:**
- Atualização de quantidades
- Remoção de itens
- Cálculo automático de subtotal
- Aplicação de descontos (se houver)
- Validação de estoque em tempo real

**Saída:** Carrinho atualizado
**Persistência:** localStorage + contexto React

#### 3.3 Visualização do Carrinho
**Processamento:**
- Carregamento de itens do localStorage
- Busca de dados atualizados dos produtos
- Cálculo de totais
- Verificação de disponibilidade

**Saída:** Lista de itens com totais
**Persistência:** Dados do localStorage + PostgreSQL

</details>

<details>
<summary><strong>📦 4. Fluxo de Pedidos</strong></summary>

#### 4.1 Criação de Pedido
**Entrada:** Itens do carrinho + endereço de entrega
**Processamento:**
- Validação de dados obrigatórios
- Verificação de estoque final
- Cálculo de totais e impostos
- Criação do pedido via POST `/pedido/cadastrar`
- Atualização de estoque dos produtos

**Saída:** Pedido criado com número de confirmação
**Persistência:** Dados salvos no PostgreSQL, carrinho limpo

#### 4.2 Acompanhamento de Pedidos
**Entrada:** ID do usuário logado
**Processamento:**
- Busca de pedidos via GET `/pedido/listar`
- Filtros por status, data, valor
- Carregamento de detalhes de cada pedido

**Saída:** Lista de pedidos com status
**Persistência:** Dados do PostgreSQL

#### 4.3 Atualização de Status
**Entrada:** ID do pedido + novo status
**Processamento:**
- Validação de permissões
- Atualização via PATCH `/pedido/atualizar`
- Notificação ao cliente

**Saída:** Status atualizado
**Persistência:** Dados atualizados no PostgreSQL

</details>

<details>
<summary><strong>📍 5. Fluxo de Endereços</strong></summary>

#### 5.1 Cadastro de Endereço
**Entrada:** Dados do endereço (CEP, rua, número, etc.)
**Processamento:**
- Validação de CEP via API externa
- Validação de campos obrigatórios
- Criação via POST `/endereco/cadastrar`
- Associação ao usuário logado

**Saída:** Endereço cadastrado
**Persistência:** Dados salvos no PostgreSQL

#### 5.2 Gerenciamento de Endereços
**Processamento:**
- Listagem de endereços do usuário
- Edição via PATCH `/endereco/atualizar`
- Remoção via DELETE `/endereco/deletar`
- Definição de endereço principal

**Saída:** Lista de endereços atualizada
**Persistência:** Dados do PostgreSQL

</details>

<details>
<summary><strong>👤 6. Fluxo de Perfil do Usuário</strong></summary>

#### 6.1 Visualização de Perfil
**Entrada:** ID do usuário logado
**Processamento:**
- Busca de dados via GET `/pessoa/buscar`
- Carregamento de informações pessoais
- Histórico de pedidos
- Endereços cadastrados

**Saída:** Dados completos do perfil
**Persistência:** Dados do PostgreSQL

#### 6.2 Atualização de Perfil
**Entrada:** Dados atualizados do usuário
**Processamento:**
- Validação de campos
- Atualização via POST `/pessoa/atualizar`
- Verificação de unicidade (email)

**Saída:** Perfil atualizado
**Persistência:** Dados atualizados no PostgreSQL

</details>

<details>
<summary><strong>❤️ 7. Fluxo de Favoritos</strong></summary>

#### 7.1 Adicionar/Remover Favoritos
**Entrada:** ID do produto + ação (adicionar/remover)
**Processamento:**
- Verificação de autenticação
- Atualização da lista de favoritos
- Persistência no localStorage

**Saída:** Lista de favoritos atualizada
**Persistência:** localStorage + contexto React

#### 7.2 Visualização de Favoritos
**Processamento:**
- Carregamento da lista do localStorage
- Busca de dados atualizados dos produtos
- Verificação de disponibilidade

**Saída:** Lista de produtos favoritos
**Persistência:** localStorage + dados do PostgreSQL

</details>

<details>
<summary><strong>📊 8. Fluxo do Dashboard Administrativo</strong></summary>

#### 8.1 Métricas de Vendas
**Entrada:** Filtros de data, categoria, fornecedor
**Processamento:**
- Agregação de dados de vendas
- Cálculo de métricas (receita, quantidade, produtos mais vendidos)
- Geração de relatórios
- Visualização em gráficos

**Saída:** Dashboard com métricas
**Persistência:** Dados agregados do PostgreSQL

#### 8.2 Gerenciamento de Produtos (Admin)
**Processamento:**
- Listagem de todos os produtos
- Filtros por categoria, status, fornecedor
- Ações em lote (ativar/desativar)
- Upload de imagens

**Saída:** Interface de gerenciamento
**Persistência:** Dados do PostgreSQL

</details>

<details>
<summary><strong>💾 9. Estados e Persistência</strong></summary>

#### 9.1 Estado Global da Aplicação
- **AuthContext:** Dados do usuário logado, token JWT
- **CartContext:** Itens do carrinho, totais, persistência no localStorage
- **ProductContext:** Cache de produtos, filtros aplicados

#### 9.2 Persistência Local
- **localStorage:** Token JWT, carrinho, favoritos, preferências
- **sessionStorage:** Dados temporários da sessão
- **Context API:** Estado reativo da aplicação

#### 9.3 Cache e Performance
- Cache de produtos no contexto React
- Debounce em buscas para otimizar requisições
- Lazy loading de componentes pesados
- Otimização de re-renders com useMemo/useCallback

</details>

<details>
<summary><strong>⚠️ 10. Tratamento de Erros</strong></summary>

#### 10.1 Validação de Dados
- Validação no frontend (UX imediata)
- Validação no backend (segurança)
- Mensagens de erro padronizadas
- Fallbacks para dados indisponíveis

#### 10.2 Estados de Loading
- Loading states para todas as operações assíncronas
- Skeletons para melhor UX
- Retry automático em falhas de rede
- Timeout de requisições (30 segundos)

</details>

<details>
<summary><strong>🛡️ 11. Segurança no Fluxo de Dados</strong></summary>

#### 11.1 Autenticação
- Tokens JWT com expiração de 24 horas
- Refresh automático de tokens
- Logout automático em token inválido
- Proteção de rotas sensíveis

#### 11.2 Autorização
- Verificação de roles (USER/ADMIN)
- Controle de acesso baseado em recursos
- Validação de propriedade de dados
- Rate limiting (100 req/min por IP)

#### 11.3 Sanitização
- Validação de entrada em todos os endpoints
- Sanitização de dados do usuário
- Proteção contra XSS e SQL injection
- Headers de segurança (CORS, CSP)

</details>

## Diagramas Visuais do Fluxo de Dados

Para melhor compreensão dos fluxos de dados da aplicação, segue os diagramas visuais:

<details>
<summary><strong>🔐 1. Fluxograma de Autenticação</strong></summary>

```
┌─────────────┐
│   Usuário   │
└──────┬──────┘
       │
       ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Login/    │───►│ Validação   │───►│ Geração     │
│  Cadastro   │    │ Credenciais │    │ Token JWT   │
└──────┬──────┘    └──────┬──────┘    └──────┬──────┘
       │                  │                  │
       ▼                  ▼                  ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ Validação   │    │ Hash        │    │ Armazenar   │
│ Frontend    │    │ Senha       │    │ localStorage│
└──────┬──────┘    └──────┬──────┘    └──────┬──────┘
       │                  │                  │
       ▼                  ▼                  ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ POST /auth/ │    │ Salvar no   │    │ AuthContext │
│ login       │    │ PostgreSQL  │    │ Ativo       │
└─────────────┘    └─────────────┘    └─────────────┘
```

</details>

<details>
<summary><strong>🛒 2. Fluxo de Compra (Produto → Carrinho → Pedido)</strong></summary>

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ Buscar      │───►│ Adicionar   │───►│ Finalizar   │
│ Produtos    │    │ ao Carrinho │    │ Pedido      │
└──────┬──────┘    └──────┬──────┘    └──────┬──────┘
       │                  │                  │
       ▼                  ▼                  ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ GET /produto│    │ localStorage│    │ POST /pedido│
│ /listar     │    │ + Context   │    │ /cadastrar  │
└──────┬──────┘    └──────┬──────┘    └──────┬──────┘
       │                  │                  │
       ▼                  ▼                  ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ Cache       │    │ Validação   │    │ Atualizar   │
│ React       │    │ Estoque     │    │ Estoque     │
└─────────────┘    └─────────────┘    └─────────────┘
```

</details>

<details>
<summary><strong>📱 3. Diagrama de Estados da Aplicação</strong></summary>

```
┌────────────────────────────────────────────────────────────────┐
│                    Estados Globais                             │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌─────────────┐    ┌─────────────┐    ┌───────────────┐       │
│  │ AuthContext │    │ CartContext │    │ ProductContext│       │
│  │             │    │             │    │               │       │
│  │ • user      │    │ • items     │    │ • products    │       │
│  │ • token     │    │ • total     │    │ • filters     │       │
│  │ • isAuth    │    │ • count     │    │ • loading     │       │
│  └─────────────┘    └─────────────┘    └───────────────┘       │
│                                                                │
├────────────────────────────────────────────────────────────────┤
│                    Persistência Local                          │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│  ┌─────────────┐    ┌───────────────┐    ┌──────────────┐      │
│  │ localStorage│    │ sessionStorage│    │ Context API  │      │
│  │             │    │               │    │              │      │
│  │ • JWT token │    │ • temp data   │    │ • reactive   │      │
│  │ • cart      │    │ • search      │    │ • state      │      │
│  │ • favorites │    │ • filters     │    │ • cache      │      │
│  └─────────────┘    └───────────────┘    └──────────────┘      │
└────────────────────────────────────────────────────────────────┘
```

</details>

<details>
<summary><strong>📊 4. Fluxo de Dados do Dashboard Administrativo</strong></summary>

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Admin     │───►│ Filtros     │───►│ Agregação   │
│ Dashboard   │    │ (Data/Cat)  │    │ de Dados    │
└──────┬──────┘    └──────┬──────┘    └──────┬──────┘
       │                  │                  │
       ▼                  ▼                  ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ Verificação │    │ Queries     │    │ Cálculo     │
│ Permissões  │    │ PostgreSQL  │    │ Métricas    │
└──────┬──────┘    └──────┬──────┘    └──────┬──────┘
       │                  │                  │
       ▼                  ▼                  ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ Role ADMIN  │    │ JOIN Tables │    │ Gráficos    │
│ Required    │    │ (Pedidos +  │    │ e Relatórios│
│             │    │ Produtos)   │    │             │
└─────────────┘    └─────────────┘    └─────────────┘
```

</details>

<details>
<summary><strong>🛡️ 5. Diagrama de Segurança e Validação</strong></summary>

```
┌─────────────────────────────────────────────────────────────┐
│                    Camadas de Segurança                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐      │
│  │ Frontend    │    │ Backend     │    │ Database    │      │
│  │             │    │             │    │             │      │
│  │ • Validação │───►│ • JWT Auth  │───►│ • Constraints│     │
│  │ • Sanitize  │    │ • Rate Limit│    │ • Indexes   │      │
│  │ • XSS Prot. │    │ • CORS      │    │ • Relations │      │
│  └─────────────┘    └─────────────┘    └─────────────┘      │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                    Fluxo de Validação                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Input → Frontend Validation → API Request → Backend        │
│    ↓              ↓              ↓              ↓           │
│  Sanitize → DTO Validation → Service Logic → Database       │
│    ↓              ↓              ↓              ↓           │
│  Response ← JSON Response ← Business Rules ← Query Result   │
└─────────────────────────────────────────────────────────────┘
```

</details>

<details>
<summary><strong>⚠️ 6. Fluxo de Tratamento de Erros</strong></summary>

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Erro      │───►│ Tratamento  │───►│ Feedback    │
│ Detectado   │    │ Centralizado│    │ Usuário     │
└──────┬──────┘    └──────┬──────┘    └──────┬──────┘
       │                  │                  │
       ▼                  ▼                  ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ Try/Catch   │    │ Error       │    │ Toast/Alert │
│ Blocks      │    │ Handler     │    │ Messages    │
└──────┬──────┘    └──────┬──────┘    └──────┬──────┘
       │                  │                  │
       ▼                  ▼                  ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ Log Error   │    │ Status Code │    │ Retry Logic │
│ Console     │    │ HTTP        │    │ (Optional)  │
└─────────────┘    └─────────────┘    └─────────────┘
```

</details>

<details>
<summary><strong>⚡ 7. Diagrama de Performance e Cache</strong></summary>

```
┌─────────────────────────────────────────────────────────────┐
│                    Estratégias de Cache                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐      │
│  │ React Cache │    │ API Cache   │    │ DB Cache    │      │
│  │             │    │             │    │             │      │
│  │ • useMemo   │    │ • Debounce  │    │ • Indexes   │      │
│  │ • useCallback│   │ • Throttle  │    │ • Views     │      │
│  │ • Context   │    │ • Retry     │    │ • Pool      │      │
│  └─────────────┘    └─────────────┘    └─────────────┘      │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                    Otimizações de Performance               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Lazy Loading → Code Splitting → Bundle Optimization        │
│       ↓              ↓              ↓                       │
│  Component → Route-based → Tree Shaking                     │
│  Loading → Chunks → Dead Code                               │
│       ↓              ↓              ↓                       │
│  Skeleton → Dynamic → Minification                          │
│  UI → Imports → Compression                                 │
└─────────────────────────────────────────────────────────────┘
```

</details>

<details>
<summary><strong>🧭 8. Fluxo de Navegação e Roteamento</strong></summary>

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│   Header    │───►│ Navigation  │───►│ Protected   │
│ Component   │    │ Menu        │    │ Routes      │
└──────┬──────┘    └──────┬──────┘    └──────┬──────┘
       │                  │                  │
       ▼                  ▼                  ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ Logo Click  │    │ Category    │    │ Auth Guard  │
│ → Home      │    │ Selection   │    │ Check       │
└──────┬──────┘    └──────┬──────┘    └──────┬──────┘
       │                  │                  │
       ▼                  ▼                  ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ React       │    │ Product     │    │ Redirect    │
│ Router      │    │ Filtering   │    │ to Login    │
└─────────────┘    └─────────────┘    └─────────────┘
```

</details>

<details>
<summary><strong>🔗 9. Diagrama de Integração Frontend-Backend</strong></summary>

```
┌─────────────────────────────────────────────────────────────┐
│                    Camada de Integração                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  Frontend (React)           Backend (NestJS)                │
│  ┌─────────────────┐       ┌─────────────────┐              │
│  │ • API Service   │◄─────►│ • Controllers   │              │
│  │ • HTTP Client   │       │ • DTOs          │              │
│  │ • Error Handler │       │ • Validation    │              │
│  │ • Auth Headers  │       │ • Guards        │              │
│  └─────────────────┘       └─────────────────┘              │
│                                                             │
│  ┌─────────────────┐       ┌─────────────────┐              │
│  │ • Hooks         │◄─────►│ • Services      │              │
│  │ • Context       │       │ • Business      │              │
│  │ • State Mgmt    │       │   Logic         │              │
│  │ • Local Storage │       │ • Database      │              │
│  └─────────────────┘       └─────────────────┘              │
└─────────────────────────────────────────────────────────────┘
```

</details>

## Tecnologias Utilizadas
[Lista das tecnologias principais que serão utilizadas no projeto.]

## Considerações de Segurança

[Discuta as considerações de segurança relevantes para a aplicação distribuída, como autenticação, autorização, proteção contra ataques, etc.]

## Implantação

[Instruções para implantar a aplicação distribuída em um ambiente de produção.]

1. Defina os requisitos de hardware e software necessários para implantar a aplicação em um ambiente de produção.
2. Escolha uma plataforma de hospedagem adequada, como um provedor de nuvem ou um servidor dedicado.
3. Configure o ambiente de implantação, incluindo a instalação de dependências e configuração de variáveis de ambiente.
4. Faça o deploy da aplicação no ambiente escolhido, seguindo as instruções específicas da plataforma de hospedagem.
5. Realize testes para garantir que a aplicação esteja funcionando corretamente no ambiente de produção.

## Testes

[Descreva a estratégia de teste, incluindo os tipos de teste a serem realizados (unitários, integração, carga, etc.) e as ferramentas a serem utilizadas.]

1. Crie casos de teste para cobrir todos os requisitos funcionais e não funcionais da aplicação.
2. Implemente testes unitários para testar unidades individuais de código, como funções e classes.
3. Realize testes de integração para verificar a interação correta entre os componentes da aplicação.
4. Execute testes de carga para avaliar o desempenho da aplicação sob carga significativa.
5. Utilize ferramentas de teste adequadas, como frameworks de teste e ferramentas de automação de teste, para agilizar o processo de teste.

# Referências

Inclua todas as referências (livros, artigos, sites, etc) utilizados no desenvolvimento do trabalho.

# Planejamento

##  Quadro de tarefas

> Apresente a divisão de tarefas entre os membros do grupo e o acompanhamento da execução, conforme o exemplo abaixo.

### Etapa 3 

Atualizado em: 01/10/2025

| Responsável          | Tarefa/Requisito                             | Iniciado em    | Prazo      | Status | Terminado em    |
| :----                |    :----                                     |      :----:    | :----:     | :----: | :----:          |
| Jully                | Front-end Web - Documentação                 | 01/10/2025     | 10/10/2025 | ✔️     |  03/10/2025     |
| Vinicius/Jully       | Projeto da Interface Web                     | 01/10/2025     | 20/10/2025 | ✔️     |   10/10/2025    |
| Jully                | Wireframes                                   | 01/10/2025     | 20/10/2025 | ✔️     |   10/10/2025    |
| Vinicius             | Design Visual                                | 01/10/2025     | 20/10/2025 | ✔️     |   10/10/2025    |
| Lucas / Italo        | Fluxo de Dados                               | 01/01/2024     | 20/10/2025 | 📝    |                 |
| Victor               | Tecnologias Utilizadas                       | 01/01/2024     | 20/10/2025 | 📝    |                 |
| Lucas                | Considerações de Segurança                   | 01/01/2024     | 20/10/2025 | 📝    |                 |
| Pedro                | Implantação                                  | 01/10/2025     | 26/10/2025 | 📝    |                 |
| Jully                | Implantação Page - Home                      | 01/10/2025     | 26/10/2025 | 📝    |                 |
| Lucas                | Implantação Page - Cadastro de usuarios      | 01/10/2025     | 26/10/2025 | 📝    |                 |
| Italo                | Implantação Page - Cadastro de produtos      | 01/10/2025     | 26/10/2025 | 📝    |                 |
| Pedro                | Implantação Page - Produtos                  | 01/10/2025     | 26/10/2025 | 📝    |                 |
| Victor               | Implantação Page - Carrinho                  | 01/10/2025     | 26/10/2025 | 📝    |                 |
| Vinicius             | Implantação Page - Favoritos                 | 01/10/2025     | 26/10/2025 | 📝    |                 |
| Pedro                | Implantação Page - Sobre nos                 | 01/10/2025     | 26/10/2025 | 📝    |                 |
| Italo                | Testes                                       | 27/10/2025     | 01/11/2025 | ❌    |                 |
| Jully                | Apresentação 3 Etapa                         | 27/10/2025     | 01/11/2025 | ❌    |                 |


Legenda:
- ✔️: terminado
- 📝: em execução
- ⌛: atrasado
- ❌: não iniciado

