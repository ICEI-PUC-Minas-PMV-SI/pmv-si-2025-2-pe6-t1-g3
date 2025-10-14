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

O projeto utiliza duas famílias de fontes principais para garantir uma tipografia moderna e legível:

**Poppins**
- URL: https://fonts.googleapis.com/css2?family=Poppins:wght@300;400&display=swap
- Utilizada principalmente em formulários de login e registro
- Pesos disponíveis: 300 (Light) e 400 (Regular)
- Aplicada em títulos e elementos de interface

**Montserrat**
- URL: https://fonts.googleapis.com/css2?family=Inter:slnt,wght@-4,100..900&family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap
- Utilizada como fonte secundária para elementos complementares
- Amplo range de pesos (100-900) e estilos (normal e itálico)
- Ideal para textos longos e descrições

**Inter** (incluída no link do Montserrat)
- Fonte padrão do sistema para o corpo do texto
- Fallback para sistemas que não suportam as fontes customizadas

#### Paleta de Cores

A paleta de cores do ZabbixStore foi desenvolvida com base em um design minimalista e profissional, utilizando tons neutros com acentos em preto para criar contraste e hierarquia visual:

**Cores Primárias:**
- <span style="display: inline-block; width: 20px; height: 20px; background-color: #000000; border: 1px solid #ccc; vertical-align: middle; margin-right: 8px;"></span> **Preto (#000000 / rgba(0, 0, 0, 0.87))**: Cor principal para botões, textos importantes e elementos de destaque
- <span style="display: inline-block; width: 20px; height: 20px; background-color: #ffffff; border: 1px solid #ccc; vertical-align: middle; margin-right: 8px;"></span> **Branco (#ffffff)**: Cor de fundo principal para cards e seções
- <span style="display: inline-block; width: 20px; height: 20px; background-color: #fafafa; border: 1px solid #ccc; vertical-align: middle; margin-right: 8px;"></span> **Cinza Claro (#fafafa / whitesmoke)**: Fundo geral da aplicação e formulários

**Cores Secundárias:**
- <span style="display: inline-block; width: 20px; height: 20px; background-color: #706969; border: 1px solid #ccc; vertical-align: middle; margin-right: 8px;"></span> **Cinza Escuro (#706969)**: Títulos de produtos e textos secundários
- <span style="display: inline-block; width: 20px; height: 20px; background-color: #c1c1c1; border: 1px solid #ccc; vertical-align: middle; margin-right: 8px;"></span> **Cinza Médio (#c1c1c1)**: Scrollbars e elementos de interface
- <span style="display: inline-block; width: 20px; height: 20px; background-color: #f1f1f1; border: 1px solid #ccc; vertical-align: middle; margin-right: 8px;"></span> **Cinza Suave (#f1f1f1)**: Fundo de scrollbars e elementos neutros

**Cores de Estado:**
- <span style="display: inline-block; width: 20px; height: 20px; background-color: #99ff00; border: 1px solid #ccc; vertical-align: middle; margin-right: 8px;"></span> **Verde (#99ff00 / rgba(153, 255, 0, 0.915))**: Mensagens de sucesso
- <span style="display: inline-block; width: 20px; height: 20px; background-color: #a52a2a; border: 1px solid #ccc; vertical-align: middle; margin-right: 8px;"></span> **Vermelho (#a52a2a / red)**: Mensagens de erro e alertas
- <span style="display: inline-block; width: 20px; height: 20px; background-color: #eff6ff; border: 1px solid #ccc; vertical-align: middle; margin-right: 8px;"></span> **Azul Claro (#eff6ff)**: Categorias de eletrônicos
- <span style="display: inline-block; width: 20px; height: 20px; background-color: #fdf2f8; border: 1px solid #ccc; vertical-align: middle; margin-right: 8px;"></span> **Rosa Claro (#fdf2f8)**: Categorias de moda
- <span style="display: inline-block; width: 20px; height: 20px; background-color: #f0fdf4; border: 1px solid #ccc; vertical-align: middle; margin-right: 8px;"></span> **Verde Claro (#f0fdf4)**: Categorias de casa
- <span style="display: inline-block; width: 20px; height: 20px; background-color: #fff7ed; border: 1px solid #ccc; vertical-align: middle; margin-right: 8px;"></span> **Laranja Claro (#fff7ed)**: Categorias de esportes

**Cores de Interação:**
- <span style="display: inline-block; width: 20px; height: 20px; background-color: #dadcd96c; border: 1px solid #ccc; vertical-align: middle; margin-right: 8px;"></span> **Hover Preto (#dadcd96c)**: Efeito hover em botões pretos
- <span style="display: inline-block; width: 20px; height: 20px; background-color: #a8a8a8; border: 1px solid #ccc; vertical-align: middle; margin-right: 8px;"></span> **Hover Cinza (#a8a8a8)**: Efeito hover em elementos cinza
- <span style="display: inline-block; width: 20px; height: 20px; background-color: rgba(0, 0, 0, 0.2); border: 1px solid #ccc; vertical-align: middle; margin-right: 8px;"></span> **Sombra Suave (rgba(0, 0, 0, 0.2))**: Sombras de cards e elementos flutuantes

#### Elementos Gráficos

**Ícones:**
- Utilização de React Icons (Feather Icons) para consistência visual
- Ícones principais: FiShoppingBag, FiStar, FiTrendingUp, FiArrowRight
- Tamanho padrão: 24px (w-6 h-6) para ícones de interface

**Sombras e Efeitos:**
- Sombras suaves com rgba(0, 0, 0, 0.1) para cards de produtos
- Sombras mais pronunciadas (rgba(0, 0, 0, 0.2)) para formulários
- Transições suaves de 0.3s para todos os elementos interativos
- Efeitos de hover com mudança de escala (scale-105) e sombra

**Bordas e Cantos:**
- Border-radius padrão de 5px para botões e inputs
- Border-radius de 9px para formulários principais
- Bordas sólidas pretas (#000000) para inputs e elementos de foco

Esta paleta de cores foi escolhida para transmitir confiança, profissionalismo e modernidade, características essenciais para uma plataforma de e-commerce, mantendo a legibilidade e acessibilidade em todos os elementos da interface.




## Fluxo de Dados

[Diagrama ou descrição do fluxo de dados na aplicação.]



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
| Jully                | Front-end Web - Documentação                 | 01/10/2025     | 10/10/2025 | ✔️    |  03/10/2025     |
| Vinicius/Jully       | Projeto da Interface Web                     | 01/10/2025     | 20/10/2025 | 📝    |                 |
| Jully                | Wireframes                                   | 01/10/2025     | 20/10/2025 | 📝    |                 |
| Vinicius             | Design Visual                                | 01/10/2025     | 20/10/2025 | 📝    |                 |
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

