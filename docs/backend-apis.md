# APIs e Web Services

A **Zabbix Store** é um e-commerce de plataforma de terceiros que permite a venda de diversos tipos de produtos, incluindo eletrônicos, roupas e itens de casa. O sistema oferece versões web e mobile, e as APIs serão responsáveis por integrar os serviços entre o front-end, o back-end e sistemas de terceiros, garantindo a comunicação segura e eficiente entre compradores e fornecedores. Entre as funcionalidades da API estão: autenticação de usuários, gerenciamento de produtos, validação de endereços e processamento de pedidos.


## Objetivos da API

O primeiro passo é definir os objetivos da sua API. O que você espera alcançar com ela? Você quer que ela seja usada por clientes externos ou apenas por aplicações internas? Quais são os recursos que a API deve fornecer?

[Inclua os objetivos da sua api.]


## Modelagem da Aplicação
[Descreva a modelagem da aplicação, incluindo a estrutura de dados, diagramas de classes ou entidades, e outras representações visuais relevantes.]


## Tecnologias Utilizadas

Existem muitas tecnologias diferentes que podem ser usadas para desenvolver APIs Web. A tecnologia certa para o seu projeto dependerá dos seus objetivos, dos seus clientes e dos recursos que a API deve fornecer.

[Lista das tecnologias principais que serão utilizadas no projeto.]

## API Endpoints

[Liste os principais endpoints da API, incluindo as operações disponíveis, os parâmetros esperados e as respostas retornadas.]

### Endpoint 1
- Método: GET
- URL: /endpoint1
- Parâmetros:
  - param1: [descrição]
- Resposta:
  - Sucesso (200 OK)
    ```
    {
      "message": "Success",
      "data": {
        ...
      }
    }
    ```
  - Erro (4XX, 5XX)
    ```
    {
      "message": "Error",
      "error": {
        ...
      }
    }
    ```

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

### Etapa 2

Atualizado em: 01/09/2025

| Responsável      | Tarefa/Requisito            | Iniciado em    | Prazo      | Status  | Terminado em    |
| :----            |    :----                    |   :----:       | :----:     | :----:  | :----:          |
| Todos            | Correção etapa 1            |  01/09/2025    | 05/09/2025 |  ✔️     | 04/09/2025      |
| Jully            |Montar a apresentação 1 Etapa|  01/09/2025    | 05/09/2025 |  📝     |                 |
| Jully            | APIs e Web Services         |  01/09/2025    | 10/09/2025 |  📝     |                 |
| Victor           | Objetivos da API            |  01/09/2025    | 10/09/2005 |  ❌     |                 |
| Vinicius / Jully | Modelagem da Aplicação      |  01/09/2025    | 12/09/2005 |  ❌     |                 |
| Vinicius         | Tecnologias Utilizadas      |  01/09/2025    | 12/09/2005 |  ❌     |                 |
| Lucas            | API Endpoints               |  01/09/2025    | 12/09/2005 |  ❌     |                 |
| Lucas / Pedro    | Tecnologias Utilizadas      |  01/09/2025    | 17/09/2005 |  ❌     |                 |
| Victor /Pedro    | Considerações de Segurança  |  01/09/2025    | 04/10/2005 |  ❌     |                 |
| Pedro / Ítalo    | Implantação                 |  01/09/2025    | 04/10/2005 |  ❌     |                 |
| Pedro            | Considerações de Segurança  |  01/09/2025    | 04/10/2005 |  ❌     |                 |
| Ítalo            | Testes                      |  01/09/2025    | 04/10/2005 |  ❌     |                 |


Legenda:
- ✔️: terminado
- 📝: em execução
- ⌛: atrasado
- ❌: não iniciado

